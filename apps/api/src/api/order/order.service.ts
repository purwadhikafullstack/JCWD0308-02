import { prisma } from '@/db.js';
import { OrderRequest, OrderId } from '@/types/order.type.js';
import { ResponseError } from '@/utils/error.response.js';
import { Validation } from '@/utils/validation.js';
import { Request, Response } from 'express';
import { OrderIdValidation, OrderValidation } from './order.validation.js';
import {
  applyVoucherDiscount,
  calculateShipping,
  calculateTotalPriceAndWeight,
  createOrder,
  getUserAndAddress,
  updateOrderItemsAndStock,
} from '@/helpers/order/addOrderHelper.js';
import { handleCartItems } from '@/helpers/order/handleCartItems.js';
import path from 'path';
import { parseEstimation } from '@/helpers/order/parseEstimation.js';
import { getPaymentLink } from '@/helpers/order/paymentGateway.js';
import { mapStatusToEnum } from '@/helpers/order/mapStatusToEnum.js';

export class OrderService {
  static addOrder = async (req: OrderRequest, res: Response) => {
    const orderRequest: OrderRequest = Validation.validate(
      OrderValidation.ORDER,
      req,
    );
    const userId = res.locals.user?.id;
    const userAddress = await getUserAndAddress(userId, orderRequest.addressId);
    const { updatedCartItem, nearestStore } = await handleCartItems(
      userId,
      userAddress,
    );
    let { totalPrice, weight } = calculateTotalPriceAndWeight(updatedCartItem);

    const { cost, estimation } = await calculateShipping(
      nearestStore,
      userAddress,
      weight,
      orderRequest.courier,
    );

    let discountProducts = 0;
    let discountShippingCost = 0;

    if (orderRequest.userVoucherId) {
      const discount = await applyVoucherDiscount(
        orderRequest.userVoucherId,
        totalPrice,
        cost,
        updatedCartItem.length,
      );
      discountProducts = discount.discountProducts;
      discountShippingCost = discount.discountShippingCost;
    }
    const finalTotalPrice = totalPrice - discountProducts;
    const finalShippingCost = cost - discountShippingCost;
    const totalPayment = finalTotalPrice + finalShippingCost;

    const orderStatus = 'AWAITING_PAYMENT';
    const maxDays = parseEstimation(estimation);
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + maxDays);
    const formattedEstimation = `${estimatedDeliveryDate.toISOString().split('T')[0]}`;
    const newOrder = await createOrder(
      orderRequest,
      userId,
      nearestStore,
      updatedCartItem,
      finalTotalPrice,
      finalShippingCost,
      formattedEstimation,
      orderStatus,
      discountProducts,
      discountShippingCost,
      totalPayment,
    );
    await updateOrderItemsAndStock(updatedCartItem, newOrder.id);

    let data = {
      transaction_details: {
        order_id: newOrder.id,
        gross_amount: totalPayment,
      },
      expiry: {
        unit: 'minutes',
        duration: 10,
      },
    };
    const paymentLink = await getPaymentLink(data);
    const updatedOrder = await prisma.order.update({
      where: { id: newOrder.id },
      data: { paymentLink: paymentLink.redirect_url },
    });

    return { ...updatedOrder, paymentLink: paymentLink.redirect_url };
  };

  //for customer
  static getOrder = async (orderId: string) => {
    const orders = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        user: true,
        orderItems: true,
      },
    });
    return orders;
  };

  static getOrderByStatus = async (
    userId: any,
    status: string,
    orderId?: string,
    date?: string,
  ) => {
    const orderStatus = mapStatusToEnum(status);
    const filters: any = { userId, orderStatus };
    if (!orderStatus)
      throw new ResponseError(401, `Invalid order status: ${status}`);
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
    const cancelOrder: OrderId = Validation.validate(
      OrderIdValidation.ORDER_ID,
      req,
    );
    const userId = res.locals.user?.id;
    const order = await prisma.order.findUnique({
      where: { id: cancelOrder.orderId },
      include: { user: true, orderItems: true },
    });

    if (!order || order.userId !== userId)
      throw new ResponseError(404, 'Order not found');
    if (order.orderStatus !== 'AWAITING_PAYMENT')
      throw new ResponseError(400, 'Order cannot be canceled');
    if (order.paymentPicture)
      throw new ResponseError(
        400,
        'Order cannot be canceled because payment proof has been uploaded',
      );

    const currentTime = new Date();
    const paymentDeadline = new Date(order.createdAt);
    paymentDeadline.setHours(paymentDeadline.getHours() + 1);

    if (currentTime > paymentDeadline) {
      throw new ResponseError(400, 'Payment deadline has passed');
    }

    const updatedOrder = await prisma.$transaction([
      prisma.order.update({
        where: { id: cancelOrder.orderId },
        data: { orderStatus: 'CANCELLED' },
      }),
      ...order.orderItems.map(
        (item: any) =>
          prisma.stock.update({
            where: { id: item.stockId },
            data: { amount: { increment: item.quantity } },
          }),
        ...order.orderItems.map((item: any) =>
          prisma.stock.update({
            where: { id: item.stockId },
            data: { amount: { increment: item.quantity } },
          }),
        ),
        ...order.orderItems.map((item: any) =>
          prisma.stockMutation.create({
            data: {
              stockId: item.stockId,
              mutationType: 'STOCK_IN',
              amount: item.quantity,
              orderId: order.id,
            },
          }),
        ),
      ),
    ]);
    return updatedOrder;
  };

  static uploadProof = async (
    orderId: any,
    file: Express.Multer.File,
    req: Request,
    res: Response,
  ) => {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new ResponseError(404, 'Order not found!');
    if (order.paymentMethod !== 'MANUAL')
      throw new ResponseError(
        400,
        'Proof of payment is not required for this payment method',
      );

    const filePath = file.path;
    const fileName = path.basename(filePath);
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentPicture: `http://localhost:3000/public/${fileName}`,
        orderStatus: 'AWAITING_CONFIRMATION',
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
    if (!order) throw new ResponseError(404, 'Order not found');
    if (order.userId !== userId) throw new ResponseError(403, 'Unauthorized');
    if (order.orderStatus !== 'DELIVERED')
      throw new ResponseError(400, 'Order is not delivered yet');
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: 'CONFIRMED' },
    });
    return updatedOrder;
  };
}
