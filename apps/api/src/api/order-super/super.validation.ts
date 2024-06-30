import { z } from 'zod';

export const ConfirmPaymentValidation = {
  CONFIRM_PAYMENT: z.object({
    orderId: z.string().uuid(),
    isAccepted: z.boolean(),
  }),
};
