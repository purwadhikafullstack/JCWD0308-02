import { OrderStatus } from '@prisma/client';

export const mapStatusToEnum = (status: string): OrderStatus | null => {
  const statusMap: { [key: string]: OrderStatus } = {
    awaiting_payment: OrderStatus.AWAITING_PAYMENT,
    awaiting_confirmation: OrderStatus.AWAITING_CONFIRMATION,
    process: OrderStatus.PROCESS,
    shipping: OrderStatus.SHIPPING,
    delivered: OrderStatus.DELIVERED,
    confirmed: OrderStatus.CONFIRMED,
    cancelled: OrderStatus.CANCELLED,
  };

  return statusMap[status.toLowerCase()] || null;
};
