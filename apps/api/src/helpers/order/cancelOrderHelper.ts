import { ResponseError } from "@/utils/error.response.js";
import { prisma } from "@/db.js";

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
    prisma.order.update({ where: { id: orderId }, data: { orderStatus: "CANCELLED" } }),
    ...orderItems.flatMap((item) => [
      prisma.stock.update({ where: { id: item.stockId }, data: { amount: { increment: item.quantity } } }),
      prisma.stockMutation.create({
        data: { stockId: item.stockId, mutationType: "STOCK_IN", amount: item.quantity, orderId },
      }),
    ]),
  ];

  const updatedOrder = await prisma.$transaction(transaction);
  return updatedOrder;
};
