import { z } from "zod";

export const CartValidation = {
  CART: z.object({
    stockId: z.string().uuid(),
    isPack: z.boolean(),
    quantity: z.number(),
  }),
};

export const patchCartValidation = {
  CART: z.object({
    cartItemId: z.string().uuid(),
    stockId: z.string().uuid(),
    quantity: z.number(),
  }),
};
