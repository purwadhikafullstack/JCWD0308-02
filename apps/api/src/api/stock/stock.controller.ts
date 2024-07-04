import { ICallback } from '@/types/index.js';
import { StockService } from './stock.service.js';
import { User } from 'lucia';
import { ResponseError } from '@/utils/error.response.js';
import { prisma } from '@/db.js';

export class StockController {
  getStocks: ICallback = async (req, res, next) => {
    try {
      const { page, limit, filters } = this.getPaginationAndFilters(req.query);
      const stocks = await StockService.getStocks(page, limit, filters);
      res.status(200).json(stocks);
    } catch (error) {
      next(error);
    }
  };

  getNearestStocks: ICallback = async (req, res, next) => {
    try {
      const { page, limit, filters } = this.getPaginationAndFilters(req.query);
      const stocks = await StockService.getNearestStocks(page, limit, filters, res);
      res.status(200).json({ status: 'OK', ...stocks });
    } catch (error) {
      next(error);
    }
  };

  getStockById: ICallback = async (req, res, next) => {
    try {
      const { stock, mutationsByMonth } = await StockService.getStockByIdWithMutationsGroupedByMonth(req.params.id);
      res.status(200).json({ stock, mutationsByMonth });
    } catch (error) {
      next(error);
    }
  };

  postStockId: ICallback = async (req, res, next) => {
    try {
      const { productId, addressId } = req.body;
      const userId = res.locals.user?.id;
      const stockId = await StockService.postStockId(
        productId,
        addressId,
        userId,
      );
      res.status(200).json({ stockId });
    } catch (error) {
      next(error);
    }
  };

  createStock: ICallback = async (req, res, next) => {
    try {
      const user = this.getUserOrFail(res.locals.user);
      const stockData = await this.getStockData(req, user);
      const stock = await StockService.createStock(stockData, user.id);
      res
        .status(201)
        .json({ status: 'OK', message: 'Stock item created!', stock });
    } catch (error) {
      next(error);
    }
  };

  updateStockAmount: ICallback = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = this.getUserOrFail(res.locals.user);
      const { amount, description, mutationType } = req.body;

      const stock = await StockService.getStockById(id);
      await this.validateStoreAdmin(stock, user);

      const updatedStock = await StockService.updateStockAmount(
        id,
        { amount, description, mutationType },
        user.id,
      );
      res
        .status(200)
        .json({ status: 'OK', message: 'Stock item updated!', updatedStock });
    } catch (error) {
      next(error);
    }
  };

  deleteStock: ICallback = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = this.getUserOrFail(res.locals.user);
      const stock = await StockService.getStockById(id);

      await this.validateStoreAdmin(stock, user);

      await StockService.deleteStock(id);
      res.status(200).json({ status: 'OK', message: 'Stock item deleted!' });
    } catch (error) {
      next(error);
    }
  };

  private getPaginationAndFilters(query: any) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);
    const filters = { ...query };
    delete filters.page;
    delete filters.limit;
    return { page, limit, filters };
  }

  private getUserOrFail(
    user: User | null,
  ): User & { storeAdmin?: { storeId: string } } {
    if (!user) throw new ResponseError(403, 'Unauthorized');
    return user as User & { storeAdmin?: { storeId: string } };
  }

  private async getStockData(
    req: any,
    user: User & { storeAdmin?: { storeId: string } },
  ) {
    const stockData = { ...req.body };
    if (user.role === 'STORE_ADMIN') {
      const storeId = await this.getStoreAdminStoreId(user);
      if (stockData.storeId !== storeId) {
        throw new ResponseError(
          403,
          'Forbidden: Cannot create stock for a different store',
        );
      }
      stockData.storeId = storeId;
    } else if (user.role !== 'SUPER_ADMIN') {
      throw new ResponseError(403, 'Forbidden');
    }
    return stockData;
  }

  private async getStoreAdminStoreId(
    user: User & { storeAdmin?: { storeId: string } },
  ) {
    if (!user.storeAdmin?.storeId) {
      const storeAdmin = await prisma.storeAdmin.findUnique({
        where: { storeAdminId: user.id },
        select: { storeId: true },
      });
      if (!storeAdmin) {
        throw new ResponseError(
          403,
          'Forbidden: Store admin without assigned store',
        );
      }
      user.storeAdmin = { storeId: storeAdmin.storeId };
    }
    return user.storeAdmin.storeId;
  }

  private async validateStoreAdmin(
    stock: any,
    user: User & { storeAdmin?: { storeId: string } },
  ) {
    if (user.role === 'STORE_ADMIN') {
      const storeId = await this.getStoreAdminStoreId(user);
      if (stock.storeId !== storeId) {
        throw new ResponseError(
          403,
          'Forbidden: Cannot perform action for a different store',
        );
      }
    } else if (user.role !== 'SUPER_ADMIN') {
      throw new ResponseError(403, 'Forbidden');
    }
  }
}
