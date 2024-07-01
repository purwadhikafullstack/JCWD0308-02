import { ICallback } from '@/types/index.js';

import { ResponseError } from '@/utils/error.response.js';
import { PaymentService } from './payment.service.js';
import { OrderStatus } from '@prisma/client';

export class PaymentController {
  updateOrderStatus: ICallback = async (req, res, next) => {
    try {
      console.log('Midtrans Notification Received');
      console.log('req.body:', req.body);

      const { order_id, transaction_status } = req.body;

      if (
        transaction_status === 'capture' ||
        transaction_status === 'settlement'
      ) {
        await PaymentService.updateOrderStatus(
          order_id,
          OrderStatus.AWAITING_CONFIRMATION,
        );
      }

      res.status(200).send('Notification received');
    } catch (error) {
      console.error('Error handling Midtrans notification:', error);
      res.status(500).send('Internal Server Error');
    }
  };
}
