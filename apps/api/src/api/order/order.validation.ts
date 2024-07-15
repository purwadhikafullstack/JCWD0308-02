import { z } from "zod";

export const OrderValidation = {
  ORDER: z.object({
    addressId: z.string().uuid(),
    paymentMethod: z.string(),
    courier: z.string(),
    service: z.string(),
    note: z.string(),
    voucherId: z.string().uuid().optional(),
    serviceDescription: z.string().optional(),
    storeId: z.string().uuid()
  }),
};

export const OrderIdValidation = {
  ORDER_ID: z.object({
    orderId: z.string().uuid(),
  }),
};

export const ConfirmPaymentValidation = {
  CONFIRM_PAYMENT: z.object({
    orderId: z.string().uuid(),
    isAccepted: z.boolean(),
  }),
};
