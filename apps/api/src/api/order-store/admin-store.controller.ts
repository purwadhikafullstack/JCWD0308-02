import { ICallback } from '@/types/index.js';
import { OrderStoreService } from './admin-store.service.js';

export class OrderStoreController {
  sendUserOrders: ICallback = async (req, res, next) => {
    try {
      const order = await OrderStoreService.sendUserOrders(req.body, res);
      return res.status(200).json({ status: 'OK', data: order });
    } catch (error) {
      next(error);
    }
  };
  cancelOrderByAdmin: ICallback = async (req, res, next) => {
    try {
      const order = await OrderStoreService.cancelOrderByAdmin(req.body, res);
      return res.status(200).json({ status: 'OK', data: order });
    } catch (error) {
      next(error);
    }
  };
}
