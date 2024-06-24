import { ICallback } from '@/types/index.js';
import { StoreService } from './store.service.js';
export class StoreController {
  getStore: ICallback = async (req, res, next) => {
    try {
      const { storeId } = req.params;
      const store = await StoreService.getStore(storeId);
      return res.status(200).json({ status: 'OK', data: store });
    } catch (error) {
      next(error);
    }
  };
}
