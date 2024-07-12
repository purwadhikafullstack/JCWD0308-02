import { ResponseError } from "@/utils/error.response.js";
import { prisma } from "@/db.js";
import { OrderStatus } from "@prisma/client";

export const checkPaymentDeadline = (createdAt: Date) => {
  const currentTime = new Date();
  const paymentDeadline = new Date(createdAt);
  paymentDeadline.setHours(paymentDeadline.getHours() + 1);

  if (currentTime > paymentDeadline) {
    throw new ResponseError(400, "Payment deadline has passed");
  }
};

export const cancelOrderTransaction = async (orderId: string, orderItems: any[]) => {
  const transaction = [
    prisma.order.update({ where: { id: orderId }, data: { orderStatus: OrderStatus.CANCELLED } }),
    ...orderItems.flatMap((item) => {
      const incrementValue = item.isPack ? item.quantity * item.stock.product.packQuantity : item.quantity;
      return [
        prisma.stock.update({ where: { id: item.stockId }, data: { amount: { increment: incrementValue } } }),
        prisma.stockMutation.create({
          data: { stockId: item.stockId, mutationType: "REFUND", amount: incrementValue, orderId },
        }),
      ];
    }),
  ];

  const updatedOrder = await prisma.$transaction(transaction);
  return updatedOrder;
};
