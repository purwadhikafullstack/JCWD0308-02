import { ICallback } from '@/types/index.js';

import { ResponseError } from '@/utils/error.response.js';
import { OrderService } from './order.service.js';

export class OrderController {
  addOrder: ICallback = async (req, res, next) => {
    try {
      const order = await OrderService.addOrder(req.body, res);
      return res.status(201).json({ status: 'OK', data: order });
    } catch (error) {
      next(error);
    }
  };
}
