import { ICallback } from '@/types/index.js';

import { ResponseError } from '@/utils/error.response.js';
import { OrderStoreService } from './stores.service.js';
import { OrderStatus } from '@prisma/client';
import { ConfirmPaymentRequest } from '@/types/order.type.js';

export class OrderStoreController {
  getOrdersByStoreAdmin: ICallback = async (req, res, next) => {
    try {
      const { storeAdminId } = req.params;
      const order = await OrderStoreService.getOrdersByStoreAdmin(storeAdminId);
      return res.status(201).json({ status: 'OK', data: order });
    } catch (error) {
      next(error);
    }
  };
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
