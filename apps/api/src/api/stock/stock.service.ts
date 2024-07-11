import { prisma } from '@/db.js';
import { Validation } from '@/utils/validation.js';
import { StockValidation } from './stock.validation.js';
import { ResponseError } from '@/utils/error.response.js';
import { findNearestStore, findStoresInRange } from '../distance/distance.service.js';
import { Response } from 'express';

export class StockService {
  static async getStocks(page: number, limit: number, filters: any) {
    const { search, storeId, ...filterOptions } = filters;
    const where: any = {};

    if (search) {
      where.OR = [
        { product: { title: { contains: search } } },
        { store: { name: { contains: search } } },
      ];
    }
    if (storeId) {
      where.storeId = storeId;
    }

    const skip = (page - 1) * limit;
    const stocks = await prisma.stock.findMany({
      skip,
      take: limit,
      where,
      include: {
        product: true,
        store: true,
      },
    });
    const total = await prisma.stock.count({ where });

    return { total, page, limit, stocks };
  }

  static async getNearestStocks(page: number, limit: number, filters: any, res: Response) {
    const { search, storeId, categoryId, sortcol, ...filterOptions } = filters;
    const where: any = {};
  
    if (search) {
      where.OR = [
        { product: { title: { contains: search } } },
        { store: { name: { contains: search } } },
      ];
    }
  
    if (categoryId) {
      where.product = {
        categoryId: categoryId
      };
    }
  
    for (const [key, value] of Object.entries(filterOptions)) {
      if (value) {
        where[key] = value;
      }
    }
  
    let store = null;
    let isServiceAvailable = false;
    if (!res.locals.address?.id) {
      store = await prisma.store.findFirst({
        orderBy: {
          createdAt: 'asc'
        }
      });
      where.storeId = store?.id;
    } else {
      const data = await findNearestStore(res.locals.address.id);
      where.storeId = data?.nearestStore?.id;
      store = data?.nearestStore;
      isServiceAvailable = data?.isServiceAvailable;
    }
  

    let orderBy: any = {};
    if (sortcol === 'popular') {
      orderBy = {
        OrderItem: {
          _count: 'desc'
        }
      };
    }
  
    delete where.skip   
    const total = await prisma.stock.count({
      where: {
        ...where
      }
    });
  
    const stocks = await prisma.stock.findMany({
      where: {
        ...where
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: orderBy,
      include: {
        product: {
          include: {
            images: true
          }
        }
      }
    });
  
    return { total, page, limit, stocks, store, isServiceAvailable };
  }
  
  
  
  static async getStockById(id: string) {
    const stock = await prisma.stock.findUnique({
      where: { id },
      include: {
        product: { select: { title: true } },
        store: { select: { name: true } },
        mutations: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!stock) throw new ResponseError(404, "Stock item not found");

    return stock;
  }

  static async createStock(stockData: any, adminId: string) {
    const data = Validation.validate(StockValidation.createStock, stockData);
    await this.checkExistingStock(data.storeId, data.productId);

    const stock = await prisma.stock.create({
      data: {
        productId: data.productId,
        storeId: data.storeId,
        amount: data.amount,
      },
    });

    await prisma.stockMutation.create({
      data: {
        stockId: stock.id,
        mutationType: 'STOCK_IN',
        amount: data.amount,
        description: 'Initial stock',
        adminId: adminId,
      },
    });

    return stock;
  }

  static async updateStockAmount(stockId: string, mutationData: any, adminId: string) {
    const data = Validation.validate(StockValidation.updateStock, mutationData);

    const stock = await this.validateAndGetStock(stockId);
    const newAmount = this.calculateNewAmount(stock.amount, data.amount, data.mutationType);

    const updatedStock = await prisma.stock.update({
      where: { id: stockId },
      data: {
        amount: newAmount,
        updatedAt: new Date(),
      },
    });

    await prisma.stockMutation.create({
      data: {
        stockId: stockId,
        mutationType: data.mutationType,
        amount: data.amount,
        description: data.description || (data.mutationType === 'STOCK_IN' ? 'Stock In' : 'Stock Out'),
        adminId: adminId,
      },
    });

    return updatedStock;
  }

  static async deleteStock(id: string) {
    await prisma.stock.delete({ where: { id } });
  }


  private static async checkExistingStock(storeId: string, productId: string) {
    const existingStock = await prisma.stock.findFirst({
      where: { storeId, productId },
    });

    if (existingStock) throw new ResponseError(400, "Stock already exists for this store and product");
  }

  private static async validateAndGetStock(stockId: string) {
    const stock = await prisma.stock.findUnique({ where: { id: stockId } });
    if (!stock) throw new ResponseError(404, "Stock item not found");
    return stock;
  }

  private static calculateNewAmount(currentAmount: number, changeAmount: number, mutationType: string) {
    const newAmount = mutationType === 'STOCK_IN' ? currentAmount + changeAmount : currentAmount - changeAmount;
    if (newAmount < 0) throw new ResponseError(400, "Insufficient stock for the operation");
    return newAmount;
  }

  static async getStockByIdWithMutationsGroupedByMonth(id: string) {
    const stock = await prisma.stock.findUnique({
      where: { id },
      include: {
        product: { select: { title: true } },
        store: { select: { name: true } },
        mutations: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!stock) throw new ResponseError(404, "Stock item not found");

    const mutationsByMonth: Record<string, any[]> = stock.mutations.reduce((acc: Record<string, any[]>, mutation) => {
      const date = new Date(mutation.createdAt);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(mutation);
      return acc;
    }, {});

    return { stock, mutationsByMonth };
  }

}
