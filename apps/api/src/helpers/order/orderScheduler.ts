import cron from "node-cron";
import { prisma } from "@/db.js";

export const orderScheduler = () => {
  //set up confirmed by user
  cron.schedule("0 0 * * *", async () => {
    const today = new Date();
    today.setDate(today.getDate() - 2);

    const ordersToConfirm = await prisma.order.findMany({
      where: {
        orderStatus: "DELIVERED",
        estimation: { lte: today.toISOString().split("T")[0] },
      },
    });
    const orderUpdates = ordersToConfirm.map((order) =>
      prisma.order.update({
        where: { id: order.id },
        data: { orderStatus: "CONFIRMED" },
      }),
    );
    await prisma.$transaction(orderUpdates);
  });

  //auto cancel order
  cron.schedule("0 * * * *", async () => {
    try {
      console.log("Cron job triggered");
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      console.log(`Finding orders created before: ${oneHourAgo}`);

      const autoCancelOrders = await prisma.order.findMany({
        where: {
          orderStatus: "AWAITING_PAYMENT",
          createdAt: { lte: oneHourAgo },
        },
        include: { orderItems: true },
      });

      const orderUpdates = autoCancelOrders.map((order) =>
        prisma.order.update({
          where: { id: order.id },
          data: { orderStatus: "CANCELLED" },
        }),
      );

      const stockUpdates = autoCancelOrders.flatMap((order) =>
        order.orderItems.map((item: any) =>
          prisma.stock.update({
            where: { id: item.stockId },
            data: { amount: { increment: item.quantity } },
          }),
        ),
      );

      const stockMutations = autoCancelOrders.flatMap((order) =>
        order.orderItems.map((item: any) =>
          prisma.stockMutation.create({
            data: {
              stockId: item.stockId,
              mutationType: "STOCK_IN",
              amount: item.quantity,
              orderId: order.id,
            },
          }),
        ),
      );

      await prisma.$transaction([...orderUpdates, ...stockUpdates, ...stockMutations]);

      console.log("Cron job completed successfully");
    } catch (error) {
      console.error("Error in cron job:", error);
    }
  });
};
