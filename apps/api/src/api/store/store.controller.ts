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
      console.log('selected store');
      console.log(res.locals.store?.id);
      const store = await StoreService.getStore(res.locals.store!?.id);
      console.log('selected store', store);
      
      return res.status(200).json({ status: 'OK', store });
    } catch (error) {
      next(error);
    }
  };

  getStores: ICallback = async (req, res, next) => {
    try {
      const stores = await StoreService.getStores()

      return res.status(200).json({ status: 'OK', stores })
    } catch (error) {
      next(error)
    }
  }

  createStore: ICallback = async (req, res, next) => {
    console.log('hiiiii');
    console.log('req body:', req.body);
    
    
    try {
      const store = await StoreService.createStore(req, res)

      console.log('Created New Store:', store);
      
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
    console.log('hiiiii');
    console.log('req body:', req.body);
    
    
    try {
      const store = await StoreService.updateStore(req, res)

      console.log('Created New Store:', store);
      
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
}
