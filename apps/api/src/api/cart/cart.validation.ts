import { z } from "zod";

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
    // addressId: z.string().uuid(),
    // productId: z.string().uuid(),
    cartItemId: z.string().uuid(),
    stockId: z.string().uuid(),
    quantity: z.number(),
  }),
};
