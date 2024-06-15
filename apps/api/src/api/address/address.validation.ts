import { z } from 'zod';

export const AddressValidation = {
  ADDRESS: z.object({
    userId: z.string().uuid(),
    address: z.string(),
    cityId: z.number(),
    coordinate: z.string(),
  }),
};
