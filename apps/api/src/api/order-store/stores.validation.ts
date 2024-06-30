import { z } from 'zod';

export const OrderIdValidation = {
  ORDER_ID: z.object({
    orderId: z.string().uuid(),
  }),
};
