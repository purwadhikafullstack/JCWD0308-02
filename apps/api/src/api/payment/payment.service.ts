import { prisma } from '@/db.js';
import { OrderStatus } from '@prisma/client';

export class PaymentService {
  static updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { orderStatus: status },
      });
      return updatedOrder;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };
}
