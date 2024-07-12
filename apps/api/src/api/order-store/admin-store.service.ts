import { prisma } from "@/db.js";

import { ChangeStatusRequest, OrderId } from "@/types/order.type.js";
import { ResponseError } from "@/utils/error.response.js";
import { Validation } from "@/utils/validation.js";
import { Request, Response } from "express";
import { ChangeStatusValidation } from "./admin-store.validation.js";
import { OrderStatus } from "@prisma/client";
import { mapNewStatus } from "@/helpers/order/mapNewStatus.js";
import { OrderIdValidation } from "../order/order.validation.js";
import { getEmailTemplate, getOrderWithUser, sendConfirmationEmail } from "@/helpers/order/orderNotificationService.js";
import { cancelOrderTransaction } from "@/helpers/order/cancelOrderHelper.js";

export class OrderStoreService {
  static getStoreAdminIdByStoreId = async (storeId: any) => {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { storeAdmins: { select: { storeAdminId: true } } },
    });

    if (!store) {
      throw new ResponseError(404, `Store with id ${storeId} not found`);
    }

    return store.storeAdmins[0].storeAdminId;
  };

  static sendUserOrders = async (req: ChangeStatusRequest, res: Response) => {
    const { orderId, newStatus } = Validation.validate(ChangeStatusValidation.CHANGE, req);
    const targetStatus = newStatus as OrderStatus;

    if (!Object.values(OrderStatus).includes(targetStatus)) throw new ResponseError(400, `Invalid status: ${newStatus}`);

    const order = await getOrderWithUser(orderId);
    if (!order) throw new ResponseError(404, "Order not found");

    const allowedTransitions: { [key in OrderStatus]: OrderStatus[] } = {
      [OrderStatus.AWAITING_PAYMENT]: [],
      [OrderStatus.AWAITING_CONFIRMATION]: [],
      [OrderStatus.PROCESS]: [OrderStatus.SHIPPING],
      [OrderStatus.SHIPPING]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CONFIRMED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    if (!allowedTransitions[order.orderStatus].includes(targetStatus)) throw new ResponseError(400, `Unsupported new status: ${newStatus}`);

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

    const templateName = targetStatus === OrderStatus.SHIPPING ? "orderShipped.html" : "orderDelivered.html";
    const subject = "Welcome to Grosirun - Order Information";
    const html = getEmailTemplate(templateName, context);

    await sendConfirmationEmail(user.contactEmail, subject, html);

    return prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: targetStatus },
    });
  };

  static cancelOrderByAdmin = async (req: OrderId, res: Response) => {
    const { orderId } = Validation.validate(OrderIdValidation.ORDER_ID, req);
    const order = await getOrderWithUser(orderId);
    if (!order) throw new ResponseError(404, "Order not found");
    if (order.orderStatus === OrderStatus.SHIPPING || order.orderStatus === OrderStatus.DELIVERED || order.orderStatus === OrderStatus.CONFIRMED) throw new ResponseError(400, "Order cannot be canceled");
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
    const templateName = "orderCanceled.html";
    const subject = "Welcome to Grosirun - Order Information";
    const html = getEmailTemplate(templateName, context);
    await sendConfirmationEmail(user.contactEmail, subject, html);

    const updatedOrder = await cancelOrderTransaction(orderId, order.orderItems);
    return updatedOrder;
  };
}
