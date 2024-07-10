import { prisma } from "@/db.js";
import { OrderRequest, OrderId } from "@/types/order.type.js";
import { ResponseError } from "@/utils/error.response.js";
import { Validation } from "@/utils/validation.js";
import { Request, Response } from "express";
import { OrderIdValidation, OrderValidation } from "./order.validation.js";
import { applyDiscounts, applyVoucherDiscount, calculateShipping, calculateTotalPriceAndWeight, getAddress, updateOrderItemsAndStock } from "@/helpers/order/addOrderHelper.js";
import { createOrder, prepareOrderData } from "@/helpers/order/addOrderToPayment.js";
import { handleCartItems } from "@/helpers/order/handleCartItems.js";
import path from "path";
import { parseEstimation } from "@/helpers/order/parseEstimation.js";
import { mapStatusToEnum } from "@/helpers/order/mapStatusToEnum.js";
import { calculateFinalPrices, handlePaymentLinkCreation } from "@/helpers/order/addOrderToPayment.js";
import { cancelOrderTransaction, checkPaymentDeadline } from "@/helpers/order/cancelOrderHelper.js";
import { OrderItemType } from "@prisma/client";

export class OrderService {
  static addOrder = async (req: OrderRequest, res: Response) => {
    const orderRequest = Validation.validate(OrderValidation.ORDER, req);
    const userId = res.locals.user?.id;
    const userAddress = await getAddress(res);
    const { address, cityId } = userAddress;
    const { updatedCartItem, nearestStore } = await handleCartItems(userId, address);
    const { totalPrice, weight } = calculateTotalPriceAndWeight(updatedCartItem);
    const { cost, estimation } = await calculateShipping(nearestStore, cityId, weight, orderRequest.courier);

    const discounts = await applyDiscounts(orderRequest, totalPrice, cost, updatedCartItem.length);
    const { finalTotalPrice, finalShippingCost, orderStatus, discountProducts, discountShippingCost, totalPayment } = await prepareOrderData(
      orderRequest,
      userId,
      nearestStore,
      updatedCartItem,
      totalPrice,
      cost,
      estimation,
      discounts,
    );

    const newOrder = await createOrder(
      orderRequest,
      userId,
      nearestStore,
      updatedCartItem,
      finalTotalPrice,
      finalShippingCost,
      estimation,
      orderStatus,
      discountProducts,
      discountShippingCost,
      totalPayment,
    );

    await updateOrderItemsAndStock(updatedCartItem, newOrder.id);
    const paymentLink = await handlePaymentLinkCreation(orderRequest, newOrder, totalPayment);

    return { ...newOrder, paymentLink };
    return { ...newOrder, paymentLink };
  };
  static getOrder = async (orderId: string) => {
    const orders = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, orderItems: true },
    });
    return orders;
  };

  static getOrderByStatus = async (userId: any, status: string, orderId?: string, date?: string) => {
    const orderStatus = mapStatusToEnum(status);
    const filters: any = { userId, orderStatus };
    if (!orderStatus) throw new ResponseError(401, `Invalid order status: ${status}`);
    if (date) {
      const parsedDate = new Date(date);
      filters.updatedAt = {
        gte: parsedDate.setHours(0, 0, 0, 0),
        lt: parsedDate.setHours(23, 59, 59, 999),
      };
    }
    const orders = await prisma.order.findMany({
      where: filters,
      include: {
        orderItems: {
          include: {
            stock: { include: { product: { include: { images: true } } } },
          },
        },
      },
    });
    return orders;
  };

  static cancelOrder = async (req: OrderId, res: Response) => {
    const cancelOrder: OrderId = Validation.validate(OrderIdValidation.ORDER_ID, req);
    const userId = res.locals.user?.id;
    const order = await prisma.order.findUnique({
      where: { id: cancelOrder.orderId },
      include: { user: true, orderItems: true },
    });
    if (!order || order.userId !== userId) throw new ResponseError(404, "Order not found");
    if (order.orderStatus !== "AWAITING_PAYMENT") throw new ResponseError(400, "Order cannot be canceled");
    if (order.paymentPicture) throw new ResponseError(400, "Order cannot be canceled because payment proof has been uploaded");
    checkPaymentDeadline(order.createdAt);
    const updatedOrder = await cancelOrderTransaction(cancelOrder.orderId, order.orderItems);
    return updatedOrder;
  };

  static uploadProof = async (orderId: any, file: Express.Multer.File, req: Request, res: Response) => {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new ResponseError(404, "Order not found!");
    if (order.paymentMethod !== "MANUAL") throw new ResponseError(400, "Proof of payment is not required for this payment method");
    const filePath = file.path;
    const fileName = path.basename(filePath);
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentPicture: `${process.env.WEB_URL}/public/${fileName}`,
        orderStatus: "AWAITING_CONFIRMATION",
      },
    });
    return updatedOrder;
  };

  static confirmOrder = async (req: OrderId, res: Response) => {
    const { orderId } = Validation.validate(OrderIdValidation.ORDER_ID, req);
    const userId = res.locals?.user?.id;
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });
    if (!order) throw new ResponseError(404, "Order not found");
    if (order.userId !== userId) throw new ResponseError(403, "Unauthorized");
    if (order.orderStatus !== "DELIVERED") throw new ResponseError(400, "Order is not delivered yet");
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: "CONFIRMED" },
    });
    return updatedOrder;
  };
}
