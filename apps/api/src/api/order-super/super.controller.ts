import { ICallback } from '@/types/index.js';

import { OrderSuperService } from './super.service.js';
import { ConfirmPaymentRequest } from '@/types/order.type.js';

export class OrderSuperController {
  getAllOrders: ICallback = async (req, res, next) => {
    try {
      const storeId = res.locals.store?.id;
      console.log('storeId from backend:', storeId);
      const order = await OrderSuperService.getAllOrders(storeId);
      return res.status(201).json({ status: 'OK', data: order });
    } catch (error) {
      next(error);
    }
  };

  confirmPayment: ICallback = async (req, res, next) => {
    try {
      const confirmPaymentRequest: ConfirmPaymentRequest = req.body;
      const result = await OrderSuperService.confirmPayment(
        confirmPaymentRequest,
        res,
      );
      return res.status(200).json({ status: 'OK', data: result });
    } catch (error) {
      next(error);
    }
  };
}
