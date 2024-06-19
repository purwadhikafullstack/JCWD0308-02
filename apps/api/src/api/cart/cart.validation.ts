import { z } from 'zod';

export const CartValidation = {
  CART: z.object({
    // stockId: z.string().uuid(),
    productId: z.string().uuid(),
    quantity: z.number(),
    isPack: z.boolean(),
    addressId: z.string().uuid(),
  }),
};

export const patchCartValidation = {
  CART: z.object({
    // stockId: z.string().uuid(),
    productId: z.string().uuid(),
    quantity: z.number(),
  }),
};
