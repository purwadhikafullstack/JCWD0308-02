import { z } from 'zod';

export const ChangeStatusValidation = {
  CHANGE: z.object({
    orderId: z.string().uuid(),
    newStatus: z.string(),
  }),
};
