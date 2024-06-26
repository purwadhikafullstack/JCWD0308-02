import { prisma } from '@/db.js';
import { Validation } from '@/utils/validation.js';
import { StockValidation } from './stock.validation.js';
import { ResponseError } from '@/utils/error.response.js';
import { findStoresInRange } from '../distance/distance.service.js';

export class StockService {
  static async getStocks(page: number, limit: number, filters: any) {
    const { search, storeId, ...filterOptions } = filters;
    const where: any = {};

    if (search) {
      where.OR = [
        { product: { title: { contains: search, mode: 'insensitive' } } },
        { store: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (storeId) {
      where.storeId = storeId;
    }

    const total = await prisma.stock.count({ where });
    const stocks = await prisma.stock.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        product: { select: { title: true } },
        store: { select: { name: true } },
      },
    });
    return { total, page, limit, stocks };
  }

  static async getStockById(id: string) {
    const stock = await prisma.stock.findUnique({
      where: { id },
      include: {
        product: { select: { title: true } },
        store: { select: { name: true } },
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

  private static buildWhereClause(filters: any) {
    const where: any = {};
    for (const [key, value] of Object.entries(filters)) {
      if (value && key !== 'page' && key !== 'limit') { // memastikan page dan limit tidak masuk dalam where
        where[key] = value;
      }
    }
    return where;
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

  static postStockId = async (
    productId: string,
    addressId: string,
    userId: any,
  ) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { addresses: true },
    });

    if (!user) throw new ResponseError(401, 'Unauthorized');

    const userAddress = user.addresses.find(
      (address: any) => address.id === addressId,
    );

    if (!userAddress) throw new ResponseError(401, 'Address not found!');

    const nearbyStore = await findStoresInRange(userAddress.coordinate, 20);

    let stock;
    for (const store of nearbyStore) {
      stock = await prisma.stock.findFirst({
        where: { productId, storeId: store.id },
      });
      if (stock) break;
    }

    if (!stock) {
      const centralStore = await prisma.store.findUnique({
        where: { slug: 'grosirun-pusat' },
      });
      if (centralStore) {
        stock = await prisma.stock.findFirst({
          where: {
            productId,
            storeId: centralStore.id,
          },
        });
      }
    }

    if (!stock) throw new ResponseError(400, 'Stock not found!');

    return stock.id;
  };
}
