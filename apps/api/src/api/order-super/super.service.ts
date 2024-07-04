import { prisma } from '@/db.js';
import { ChangeStatusRequest } from '@/types/order.type.js';
import { ResponseError } from '@/utils/error.response.js';
import { Validation } from '@/utils/validation.js';
import { Response } from 'express';
import { ConfirmPaymentValidation } from './super.validation.js';
import { OrderStatus, PaymentMethod } from '@prisma/client';

import {
  getEmailTemplate,
  getOrderWithUser,
  sendConfirmationEmail,
  updateOrderStatus,
} from '@/helpers/order/confirmPaymentByAdmin.js';
import { mapNewStatus } from '@/helpers/order/mapNewStatus.js';
export class OrderSuperService {
  //for super admin

  static getAllOrders = async (
    page: number,
    perPage: number,
    res: Response,
  ) => {
    const storeId = res.locals.store?.id;
    const role = res.locals.user?.role;
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: { storeAdmins: true },
    });

    const storeAdmin = store?.storeAdmins?.[0];
    const storeAdminId = storeAdmin?.storeAdminId;

    let whereClause;
    if (role === 'SUPER_ADMIN') {
      whereClause = { storeId };
    } else if (role === 'STORE_ADMIN') {
      whereClause = { storeAdminId };
    } else {
      throw new ResponseError(401, 'Unauthorized role');
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        orderItems: { include: { stock: { include: { product: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      skip: perPage * (page - 1),
      take: perPage,
    });

    const totalCount = await prisma.order.count({ where: whereClause });

    return { orders, totalCount };
  };

  static confirmPayment = async (req: ChangeStatusRequest, res: Response) => {
    const { orderId, newStatus } = Validation.validate(
      ConfirmPaymentValidation.CONFIRM_PAYMENT,
      req,
    );
    const order = await getOrderWithUser(orderId);

    if (!order) throw new ResponseError(404, 'Order not found');
    if (order.orderStatus !== 'AWAITING_CONFIRMATION')
      throw new ResponseError(400, 'Order is not awaiting confirmation');
    if (PaymentMethod.MANUAL && !order.paymentPicture)
      throw new ResponseError(400, 'Order can not be processed');
    const user = order.user;
    const mappedStatus: OrderStatus = mapNewStatus(newStatus);
    const templateName =
      newStatus === 'PROCESS'
        ? 'paymentConfirmed.html'
        : 'paymentRejected.html';
    const subject = 'Welcome to Grosirun - Payment Confirmation';
    const html = getEmailTemplate(templateName, { name: user.displayName });

    await sendConfirmationEmail(user.email, subject, html);
    const updated = await updateOrderStatus(orderId, mappedStatus);

    return updated;
  };
}
