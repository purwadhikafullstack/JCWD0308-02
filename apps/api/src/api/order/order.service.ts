import { prisma } from '@/db.js';
import { OrderRequest, CancelOrder } from '@/types/order.type.js';
import { ResponseError } from '@/utils/error.response.js';
import { Validation } from '@/utils/validation.js';
import { Response } from 'express';
import { CancelValidation, OrderValidation } from './order.validation.js';
import {
  applyVoucherDiscount,
  calculateShipping,
  calculateTotalPriceAndWeight,
  createOrder,
  getUserAndAddress,
  updateOrderItemsAndStock,
} from '@/helpers/order/addOrderHelper.js';
import { handleCartItems } from '@/helpers/order/handleCartItems.js';

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
    const newOrder = await createOrder(
      orderRequest,
      userId,
      nearestStore,
      updatedCartItem,
      totalPrice,
      cost,
      cost,
      estimation,
    );
    await updateOrderItemsAndStock(updatedCartItem, newOrder.id);
    return newOrder;
  };

  static getOrder = async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { status: true },
    });
    if (!user) throw new ResponseError(401, 'Unauthorized');
    const order = await prisma.order.findMany({
      where: { userId },
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
    return order;
  };

  static cancelOrder = async (req: CancelOrder, res: Response) => {
    const cancelOrder: CancelOrder = Validation.validate(
      CancelValidation.CANCEL,
      req,
    );
    const userId = res.locals.user?.id;
    const order = await prisma.order.findUnique({
      where: { id: cancelOrder.orderId },
      include: { user: true },
    });

    if (!order || order.userId !== userId) {
      throw new ResponseError(404, 'Order not found');
    }
    if (order.orderStatus !== 'AWAITING_PAYMENT') {
      throw new ResponseError(400, 'Order cannot be canceled');
    }

    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: cancelOrder.orderId },
    });
    if (orderItems.length === 0)
      throw new ResponseError(400, 'No order items found for this order');

    for (const orderItem of orderItems) {
      await prisma.stock.update({
        where: { id: orderItem.stockId },
        data: { amount: { increment: orderItem.quantity } },
      });
    }

    const canceledOrder = await prisma.order.update({
      where: { id: cancelOrder.orderId },
      data: { orderStatus: 'CANCELLED' },
    });
    return canceledOrder;
  };
}
