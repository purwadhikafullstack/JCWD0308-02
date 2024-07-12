import { ICallback } from '@/types/index.js';
import { PaymentService } from './payment.service.js';
import { OrderStatus } from '@prisma/client';
import { getEmailTemplate, getOrderWithUser, sendConfirmationEmail } from '@/helpers/order/orderNotificationService.js';

export class PaymentController {
  updateOrderStatus: ICallback = async (req, res, next) => {
    try {
      const { order_id, transaction_status } = req.body;
      if (
        transaction_status === 'capture' ||
        transaction_status === 'settlement'
      ) {
        await PaymentService.updateOrderStatus(
          order_id,
          OrderStatus.AWAITING_CONFIRMATION,
        );
        const order = await getOrderWithUser(order_id);
        const user = order?.user;
        const subject = 'Welcome to Grosirun - Payment Confirmation';
        const html = getEmailTemplate('paymentConfirmed.html', {
          name: user?.displayName,
        });

        await sendConfirmationEmail(user?.email, subject, html);
      }
      res.status(200).json({ status: 'OK' });
    } catch (error) {
      next(error);
    }
  };
}
