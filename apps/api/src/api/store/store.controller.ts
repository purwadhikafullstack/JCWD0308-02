import { ICallback } from '@/types/index.js';
import { StoreService } from './store.service.js';
import { Request, Response, NextFunction } from 'express';

export class StoreController {
  getStore: ICallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { storeId } = req.params;
      const store = await StoreService.getStore(storeId);
      return res.status(200).json({ status: 'OK', data: store });
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
}
