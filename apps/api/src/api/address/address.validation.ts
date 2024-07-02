import { z, ZodType } from 'zod';

export class AddressValidation  {
  static readonly CREATE = z.object({
    userId: z.string().uuid(),
    labelAddress: z.string(),
    recipientName: z.string(),
    phone: z.string(),
    address: z.string(),
    cityId: z.string().transform(id => +id),
    note: z.string().optional(),
    coordinate: z.string(),
    latitude: z.string(),
    longitude: z.string(),
    isMainAddress: z.boolean().default(false).optional(),
  })
};

export type CreateAddressRequest = z.infer<typeof AddressValidation.CREATE>

