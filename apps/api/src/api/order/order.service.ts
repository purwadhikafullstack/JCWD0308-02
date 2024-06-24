import { prisma } from '@/db.js';
import {
  OrderRequest,
  ConfirmPaymentRequest,
  OrderId,
} from '@/types/order.type.js';
import { ResponseError } from '@/utils/error.response.js';
import { Validation } from '@/utils/validation.js';
import { Request, Response } from 'express';
import {
  ConfirmPaymentValidation,
  OrderIdValidation,
  OrderValidation,
} from './order.validation.js';
import {
  applyVoucherDiscount,
  calculateShipping,
  calculateTotalPriceAndWeight,
  createOrder,
  getUserAndAddress,
  updateOrderItemsAndStock,
} from '@/helpers/order/addOrderHelper.js';
import { handleCartItems } from '@/helpers/order/handleCartItems.js';
import { OrderStatus } from '@prisma/client';
import { uploader } from '@/helpers/uploader.js';

import { parseEstimation } from '@/helpers/order/parseEstimation.js';

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

    if (orderRequest.userVoucherId) {
      totalPrice = await applyVoucherDiscount(
        orderRequest.userVoucherId,
        totalPrice,
        updatedCartItem.length,
      );
    }
    const { cost, estimation } = await calculateShipping(
      nearestStore,
      userAddress,
      weight,
      orderRequest.courier,
    );
    const orderStatus =
      orderRequest.paymentMethod === 'MANUAL'
        ? 'AWAITING_PAYMENT'
        : 'AWAITING_CONFIRMATION';
    const maxDays = parseEstimation(estimation);
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + maxDays);
    const formattedEstimation = `${estimatedDeliveryDate.toISOString().split('T')[0]}`;
    const newOrder = await createOrder(
      orderRequest,
      userId,
      nearestStore,
      updatedCartItem,
      totalPrice,
      cost,
      cost,
      formattedEstimation,
      orderStatus,
    );
    await updateOrderItemsAndStock(updatedCartItem, newOrder.id);
    return newOrder;
  };

  //for super admin
  static getAllOrders = async (storeId: string) => {
    const orders = await prisma.order.findMany({
      where: storeId ? { storeId } : {},
      include: {
        orderItems: { include: { stock: { include: { product: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return orders;
  };

  //for store admin
  static getOrdersByStoreAdmin = async (storeAdminId: string) => {
    const orders = await prisma.order.findMany({
      where: { storeAdminId },
      include: {
        orderItems: { include: { stock: { include: { product: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return orders;
  };

  //for customer
  static getOrder = async (req: Request, res: Response) => {
    const userId = res.locals.user?.id;
    if (!userId) throw new ResponseError(403, 'Unauthorized');
    const { orderId, orderStatus } = req.query;
    const filter: any = {
      userId,
    };
    if (orderId) filter.id = String(orderId);

    if (orderStatus) filter.orderStatus = String(orderStatus);

    const orders = await prisma.order.findMany({
      where: filter,
      include: {
        orderItems: {
          include: {
            stock: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
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

    // const upload = uploader('payment-proof', 'orders');
    // return new Promise<string>((resolve, reject) => {
    //   upload.single('proof')(req, res, async (error: any) => {
    //     if (error) {
    //       reject(
    //         new ResponseError(400, `Failed to Upload payment proof: ${error}`),
    //       );
    //     }
    //     const filePath = req?.file?.path!;
    //     await prisma.order.update({
    //       where: { id: orderId },
    //       data: {
    //         paymentPicture: filePath,
    //         orderStatus: 'AWAITING_CONFIRMATION',
    //       },
    //     });
    //     resolve(filePath);
    //   });
    // });
    const filePath = file.path;
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentPicture: filePath,
        orderStatus: 'AWAITING_CONFIRMATION',
      },
    });
    return filePath;
  };
  static confirmPayment = async (req: ConfirmPaymentRequest, res: Response) => {
    const { orderId, isAccepted } = Validation.validate(
      ConfirmPaymentValidation.CONFIRM_PAYMENT,
      req,
    );
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });
    if (!order) throw new ResponseError(404, 'Order not found');
    if (order.orderStatus !== 'AWAITING_CONFIRMATION')
      throw new ResponseError(400, 'Order is not awaiting confirmation');
    let newStatus: OrderStatus;
    if (isAccepted) {
      newStatus = 'PROCESS';
    } else {
      newStatus = 'AWAITING_PAYMENT';
    }
    const updatedStatus = await prisma.$transaction(
      async (tx): Promise<void> => {
        await tx.order.update({
          where: { id: orderId },
          data: { orderStatus: newStatus },
        });
      },
    );
    return updatedStatus;
  };
  static sendUserOrders = async (req: OrderId, res: Response) => {
    const { orderId } = Validation.validate(OrderIdValidation.ORDER_ID, req);
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });
    if (!order) throw new ResponseError(404, 'Order not found');
    if (order.orderStatus !== 'PROCESS')
      throw new ResponseError(400, 'Can not send the order!');
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: 'DELIVERED' },
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
  static cancelOrderByAdmin = async (req: OrderId, res: Response) => {
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
    if (order.orderStatus === 'DELIVERED' || 'CONFIRMED')
      throw new ResponseError(400, 'Order cannot be canceled');
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
}
