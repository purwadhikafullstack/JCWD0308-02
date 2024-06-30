import cron from 'node-cron';
import { prisma } from '@/db.js';
import { OrderStatus, PaymentMethod } from '@prisma/client';

//set up confirmation by admin store
// cron.schedule('0 * * * *', async () => {
//   try {
//     const currentTime = new Date();
//     const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000); // 1 hour ago

//     const ordersToCancel = await prisma.order.findMany({
//       where: {
//         paymentMethod: PaymentMethod.MANUAL,
//         orderStatus: OrderStatus.AWAITING_PAYMENT,
//         createdAt: { lt: oneHourAgo },
//         paymentPicture: null,
//       },
//     });

//     if (ordersToCancel.length > 0) {
//       await prisma.$transaction(
//         ordersToCancel.map((order) =>
//           prisma.order.update({
//             where: { id: order.id },
//             data: { orderStatus: OrderStatus.CANCELLED },
//           }),
//         ),
//       );

//       console.log(`${ordersToCancel.length} orders automatically canceled.`);
//     }
//   } catch (error) {
//     console.error('Error running order cancellation cron job:', error);
//   }
// });

//set up confirmed by user
cron.schedule('0 0 * * *', async () => {
  const today = new Date();
  today.setDate(today.getDate() - 2);

  const ordersToConfirm = await prisma.order.findMany({
    where: {
      orderStatus: 'DELIVERED',
      estimation: { lte: today.toISOString().split('T')[0] },
    },
  });
  const orderUpdates = ordersToConfirm.map((order) =>
    prisma.order.update({
      where: { id: order.id },
      data: { orderStatus: 'CONFIRMED' },
    }),
  );
  await prisma.$transaction(orderUpdates);
});
console.log('pingpongpong');
//cancel otomatis
cron.schedule('0 * * * *', async () => {
  try {
    console.log('Cron job triggered');
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    console.log(`Finding orders created before: ${oneHourAgo}`);

    const autoCancelOrders = await prisma.order.findMany({
      where: {
        orderStatus: 'AWAITING_PAYMENT',
        createdAt: { lte: oneHourAgo },
      },
      include: { orderItems: true },
    });

    const orderUpdates = autoCancelOrders.map((order) =>
      prisma.order.update({
        where: { id: order.id },
        data: { orderStatus: 'CANCELLED' },
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
            mutationType: 'STOCK_IN',
            amount: item.quantity,
            orderId: order.id,
          },
        }),
      ),
    );

    await prisma.$transaction([
      ...orderUpdates,
      ...stockUpdates,
      ...stockMutations,
    ]);

    console.log('Cron job completed successfully');
  } catch (error) {
    console.error('Error in cron job:', error);
  }
});
