import { z } from 'zod';

export const CartValidation = {
  CART: z.object({
    stockId: z.string().uuid(),
    quantity: z.number(),
    isPack: z.boolean(),
  }),
};

export const patchCartValidation = {
  CART: z.object({
    stockId: z.string().uuid(),
    quantity: z.number(),
  }),
};
