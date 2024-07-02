import { prisma } from '@/db.js';
import { OrderId } from '@/types/order.type.js';
import { ResponseError } from '@/utils/error.response.js';
import { Validation } from '@/utils/validation.js';
import { Request, Response } from 'express';
import { OrderIdValidation } from './admin-store.validation.js';

export class OrderStoreService {
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
