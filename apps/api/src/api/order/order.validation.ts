import { z } from 'zod';

export const OrderValidation = {
  ORDER: z.object({
    addressId: z.string().uuid(),
    paymentMethod: z.string(),
    courier: z.string(),
    service: z.string(),
    note: z.string(),
  }),
};
