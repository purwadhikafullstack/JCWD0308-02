import { ICallback } from '@/types/index.js';
import { PaymentService } from './payment.service.js';
import { OrderStatus } from '@prisma/client';
import { getEmailTemplate, getOrderWithUser, sendConfirmationEmail } from '@/helpers/order/orderNotificationService.js';
import { prisma } from '@/db.js';

export class PaymentController {
  updateOrderStatus: ICallback = async (req, res, next) => {
    try {
      const { order_id, transaction_status } = req.body;
      const order = await prisma.order.findUnique({
        where: { id: order_id },
        include: {
          orderItems: {
            include: {
              stock: true,
            },
          },
          user: true,
        },
      });

      if (!order) {
        return res.status(404).json({ status: 'Order not found' });
      }

      if (transaction_status === 'settlement') {
        const hasStockIssue = order.orderItems.some((item) => item.quantity > item.stock.amount);

        if (hasStockIssue) {
          await PaymentService.updateOrderStatus(order_id, OrderStatus.CANCELLED);
          await updateStockOnCancellation(order.orderItems);
          return res.status(409).json({ status: 'Insufficient stock', orderStatus: 'CANCELLED' });
        }

        await PaymentService.updateOrderStatus(order_id, OrderStatus.AWAITING_CONFIRMATION);

        const user = order.user;
        const subject = 'Welcome to Grosirun - Payment Confirmation';
        const html = getEmailTemplate('paymentConfirmed.html', { name: user.displayName });
        await sendConfirmationEmail(user.email, subject, html);
      } else if (transaction_status === 'cancel' || transaction_status === 'expire' || transaction_status === 'deny') {
        await PaymentService.updateOrderStatus(order_id, OrderStatus.CANCELLED);
        await updateStockOnCancellation(order.orderItems);
      }

      res.status(200).json({ status: 'OK' });
    } catch (error) {
      next(error);
    }
  };
}

const updateStockOnCancellation = async (items: any) => {
  for (const item of items) {
    await prisma.stock.update({
      where: { id: item.stockId },
      data: { amount: { increment: item.quantity } },
    });

    await prisma.stockMutation.create({
      data: {
        stockId: item.stockId,
        mutationType: 'STOCK_IN',
        amount: item.quantity,
        description: 'Order cancelled',
        orderId: item.orderId,
      },
    });
  }
};
