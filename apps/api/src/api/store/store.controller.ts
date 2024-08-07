import { ICallback } from '@/types/index.js';
import { StoreService } from './store.service.js';
import { Request, Response, NextFunction } from 'express';
import { serializeCookie } from 'oslo/cookie';
import { NODE_ENV } from '@/config.js';

export class StoreController {
  getStore: ICallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { storeId } = req.params;
      const store = await StoreService.getStore(storeId);
      return res.status(200).json({ status: 'OK', store });
    } catch (error) {
      next(error);
    }
  };

  getStoreAdmin: ICallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { storeId } = req.params;
      const admins = await StoreService.getStoreAdmin(storeId);
      
      return res.status(200).json({ status: 'OK', admins });
    } catch (error) {
      next(error);
    }
  };

  getAllStores: ICallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stores = await StoreService.getAllStores();
      return res.status(200).json({ status: 'OK', data: stores });
    } catch (error) {
      next(error);
    }
  };

  getSelectedStore: ICallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const store = await StoreService.getStore(res.locals.store!?.id);
      
      return res.status(200).json({ status: 'OK', store });
    } catch (error) {
      next(error);
    }
  };

  getStores: ICallback = async (req, res, next) => {
    try {
      const { page, limit, filters } = this.getPaginationAndFilters(req.query);
      const data = await StoreService.getStores(page, limit, filters, res)

      return res.status(200).json({ status: 'OK', ...data })
    } catch (error) {
      next(error)
    }
  }

  createStore: ICallback = async (req, res, next) => {
    try {
      const store = await StoreService.createStore(req, res)

      res.appendHeader("Set-Cookie", serializeCookie('storeId', store?.id!, {
        path: '/',
        secure: NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
      }))
      // res.end()
      return res.status(200).json({ status: 'OK', store })
    } catch (error) {
      next(error)
    }
  }

  updateStore: ICallback = async (req, res, next) => {
    try {
      const store = await StoreService.updateStore(req, res)
      res.appendHeader("Set-Cookie", serializeCookie('storeId', store?.id!, {
        path: '/',
        secure: NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
      }))
      // res.end()
      return res.status(200).json({ status: 'OK', store })
    } catch (error) {
      next(error)
    }
  }

  deleteStore: ICallback = async (req, res, next) => {
    try {
      const updated = await StoreService.deleteStore(req.params.storeId, res)
      
      res.appendHeader("Set-Cookie", serializeCookie('storeId', updated.storeFallback?.id!, {
        path: '/',
        secure: NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax',
      }))
      // res.end()
      return res.status(200).json({ status: 'OK', message: `${updated.deletedStore.name} has been deleted!`, ...updated })
    } catch (error) {
      next(error)
    }
  }

  private getPaginationAndFilters(query: any) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);
    const filters = { ...query };
    delete filters.page;
    delete filters.limit;
    return { page, limit, filters };
  }
}
