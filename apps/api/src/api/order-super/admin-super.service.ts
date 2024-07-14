import { prisma } from "@/db.js";
import { ChangeStatusRequest } from "@/types/order.type.js";
import { ResponseError } from "@/utils/error.response.js";
import { Validation } from "@/utils/validation.js";
import { Response } from "express";
import { ConfirmPaymentValidation } from "./admin-super.validation.js";
import { OrderItem, OrderStatus, PaymentMethod } from "@prisma/client";

import { getEmailTemplate, getOrderWithUser, sendConfirmationEmail, updateOrderStatus } from "@/helpers/order/orderNotificationService.js";
import { mapNewStatus } from "@/helpers/order/mapNewStatus.js";
export class OrderSuperService {
  static getAllOrders = async (page: number, perPage: number, res: Response) => {
    const storeId = res.locals.store?.id;
    const role = res.locals.user?.role;
    const store = await prisma.store.findUnique({ where: { id: storeId }, include: { storeAdmins: true } });

    let whereClause;
    if (role === "SUPER_ADMIN" || "STORE_ADMIN") {
      whereClause = { storeId };
    } else {
      throw new ResponseError(401, "Unauthorized role");
    }
    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        orderItems: { include: { stock: { include: { product: true } } } },
      },
      orderBy: { createdAt: "desc" },
      skip: perPage * (page - 1),
      take: perPage,
    });

    const totalCount = await prisma.order.count({ where: whereClause });
    return { orders, totalCount };
  };

  static confirmPayment = async (req: ChangeStatusRequest, res: Response) => {
    const { orderId, newStatus } = Validation.validate(ConfirmPaymentValidation.CONFIRM_PAYMENT, req);
    const order = await getOrderWithUser(orderId);

    if (!order) {
      throw new ResponseError(404, 'Order not found');
    }

    const currentStatus = order.orderStatus as OrderStatus;

    const allowedTransitions: { [key in OrderStatus]: OrderStatus[] } = {
      [OrderStatus.AWAITING_PAYMENT]: [],
      [OrderStatus.AWAITING_CONFIRMATION]: [OrderStatus.AWAITING_PAYMENT, OrderStatus.PROCESS],
      [OrderStatus.PROCESS]: [OrderStatus.SHIPPING],
      [OrderStatus.SHIPPING]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CONFIRMED]: [],
      [OrderStatus.CANCELLED]: [],
    };
    if (!allowedTransitions[currentStatus].includes(newStatus)) {
      throw new ResponseError(403, `Invalid status transition from ${currentStatus} to ${newStatus}`);
    }
    if (currentStatus === OrderStatus.AWAITING_CONFIRMATION && PaymentMethod.MANUAL && !order.paymentPicture) {
      throw new ResponseError(400, 'Order cannot be processed without payment picture');
    }
    const user = order.user;
    const items = order.orderItems.map((item: any) => ({
      name: item.stock.product.title,
      quantity: item.quantity,
    }));
    const context = {
      name: user.displayName,
      orderId: order.id,
      totalPrice: order.totalPrice,
      items: items,
    };

    const mappedStatus: OrderStatus = mapNewStatus(newStatus);
    const templateName = newStatus === OrderStatus.PROCESS ? 'paymentConfirmed.html' : 'paymentRejected.html';
    const subject = 'Welcome to Grosirun - Payment Confirmation';
    const html = getEmailTemplate(templateName, context);

    await sendConfirmationEmail(user.contactEmail, subject, html);
    const updated = await updateOrderStatus(orderId, mappedStatus);

    return updated;
  };
}
