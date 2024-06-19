import cron from 'node-cron';
import { prisma } from '@/db.js';
import { OrderStatus } from '@prisma/client';

//set up confirmation by admin store
cron.schedule('0 * * * *', async () => {
  try {
    const currentTime = new Date();
    const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000); // 1 hour ago

    const ordersToCancel = await prisma.order.findMany({
      where: {
        orderStatus: OrderStatus.AWAITING_PAYMENT,
        createdAt: { lt: oneHourAgo },
        paymentPicture: null, // Check that payment proof hasn't been uploaded
      },
    });

    if (ordersToCancel.length > 0) {
      await prisma.$transaction(
        ordersToCancel.map((order) =>
          prisma.order.update({
            where: { id: order.id },
            data: { orderStatus: OrderStatus.CANCELLED },
          }),
        ),
      );

      console.log(`${ordersToCancel.length} orders automatically canceled.`);
    }
  } catch (error) {
    console.error('Error running order cancellation cron job:', error);
  }
});

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
