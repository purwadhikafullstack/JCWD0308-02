import { prisma } from "@/db.js";

import { ChangeStatusRequest, OrderId } from "@/types/order.type.js";
import { ResponseError } from "@/utils/error.response.js";
import { Validation } from "@/utils/validation.js";
import { Request, Response } from "express";
import { ChangeStatusValidation } from "./admin-store.validation.js";
import { OrderStatus } from "@prisma/client";
import { mapNewStatus } from "@/helpers/order/mapNewStatus.js";
import { OrderIdValidation } from "../order/order.validation.js";

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
    if (!Object.values(OrderStatus).includes(newStatus as OrderStatus)) throw new ResponseError(400, `Invalid status: ${newStatus}`);
    const order = await prisma.order.findUnique({ where: { id: orderId }, include: { user: true } });
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
    const currentStatus = order.orderStatus;
    const targetStatus = newStatus as OrderStatus;
    if (!allowedTransitions[currentStatus].includes(targetStatus)) throw new ResponseError(400, `Unsupported new status: ${newStatus}`);
    const updatedOrder = await prisma.order.update({ where: { id: orderId }, data: { orderStatus: targetStatus } });
    return updatedOrder;
  };

  static cancelOrderByAdmin = async (req: OrderId, res: Response) => {
    const { orderId } = Validation.validate(OrderIdValidation.ORDER_ID, req);
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });
    if (!order) throw new ResponseError(404, "Order not found");
    if (order.orderStatus === OrderStatus.SHIPPING || order.orderStatus === OrderStatus.DELIVERED || order.orderStatus === OrderStatus.CONFIRMED) throw new ResponseError(400, "Order cannot be canceled");

    const updatedOrder = await prisma.$transaction([
      prisma.order.update({ where: { id: orderId }, data: { orderStatus: OrderStatus.CANCELLED } }),
      ...order.orderItems.map((item: any) => prisma.stock.update({ where: { id: item.stockId }, data: { amount: { increment: item.quantity } } })),
      ...order.orderItems.map((item: any) => prisma.stockMutation.create({ data: { stockId: item.stockId, mutationType: "REFUND", amount: item.quantity, orderId: order.id } })),
    ]);
    return updatedOrder;
  };
}
