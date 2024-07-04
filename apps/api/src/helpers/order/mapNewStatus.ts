import { OrderStatus } from '@prisma/client';

export const mapNewStatus = (newStatus: string): OrderStatus => {
  switch (newStatus) {
    case 'AWAITING_PAYMENT':
      return OrderStatus.AWAITING_PAYMENT;
    case 'PROCESS':
      return OrderStatus.PROCESS;
    case 'SHIPPING':
      return OrderStatus.SHIPPING;
    case 'CANCELLED':
      return OrderStatus.CANCELLED;
    default:
      throw new Error(`Unsupported new status: ${newStatus}`);
  }
};
