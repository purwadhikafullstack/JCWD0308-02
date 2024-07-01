import { ICallback } from '@/types/index.js';

import { OrderSuperService } from './super.service.js';
import { ConfirmPaymentRequest } from '@/types/order.type.js';

export class OrderSuperController {
  getAllOrders: ICallback = async (req, res, next) => {
    try {
      const storeId = res.locals.store?.id;
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.perPage as string) || 10;
      console.log('storeId from backend:', storeId);
      const { orders, totalCount } = await OrderSuperService.getAllOrders(
        storeId,
        page,
        perPage,
      );
      return res.status(201).json({ status: 'OK', data: orders, totalCount });
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
