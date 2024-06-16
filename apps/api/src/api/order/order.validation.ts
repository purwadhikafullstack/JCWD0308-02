import { z } from 'zod';

export const OrderValidation = {
  ORDER: z.object({
    addressId: z.string().uuid(),
    paymentMethod: z.string(),
    courier: z.string(),
    service: z.string(),
    note: z.string(),
    voucherId: z.string().uuid().optional(),
  }),
};

export const CancelValidation = {
  CANCEL: z.object({
    orderId: z.string().uuid(),
  }),
};
