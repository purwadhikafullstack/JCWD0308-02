import { prisma } from '@/db.js';
import { ConfirmPaymentRequest } from '@/types/order.type.js';
import { ResponseError } from '@/utils/error.response.js';
import { Validation } from '@/utils/validation.js';
import { Request, Response } from 'express';
import { ConfirmPaymentValidation } from './super.validation.js';
import { OrderStatus } from '@prisma/client';
import { transporter } from '@/helpers/nodemailers.js';
import handlebars from 'handlebars';
import path from 'path';
import fs from 'fs';
import {
  getEmailTemplate,
  getOrderWithUser,
  sendConfirmationEmail,
  updateOrderStatus,
} from '@/helpers/order/confirmPaymentByAdmin.js';
export class OrderSuperService {
  //for super admin
  static getAllOrders = async (storeId: any) => {
    const orders = await prisma.order.findMany({
      where: { storeId },
      include: {
        orderItems: { include: { stock: { include: { product: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return orders;
  };

  static confirmPayment = async (req: ConfirmPaymentRequest, res: Response) => {
    const { orderId, isAccepted } = Validation.validate(
      ConfirmPaymentValidation.CONFIRM_PAYMENT,
      req,
    );
    const order = await getOrderWithUser(orderId);

    if (!order) throw new ResponseError(404, 'Order not found');
    if (order.orderStatus !== 'AWAITING_CONFIRMATION')
      throw new ResponseError(400, 'Order is not awaiting confirmation');

    const user = order.user;
    const newStatus: OrderStatus = isAccepted ? 'PROCESS' : 'AWAITING_PAYMENT';
    const templateName = isAccepted
      ? 'paymentConfirmed.html'
      : 'paymentRejected.html';
    const subject = 'Welcome to Grosirun - Payment Confirmation';
    const html = getEmailTemplate(templateName, { name: user.displayName });

    await sendConfirmationEmail(user.email, subject, html);
    const updated = await updateOrderStatus(orderId, newStatus);

    return updated;
  };
}
