import { ZodType, z } from 'zod';

export class StoreValidation {
  static readonly CREATE = z.object({
    name: z.string().min(1),
    slug: z.string().min(8).max(512),
    imageUrl: z.string(),
    address: z.string(),
    coordinate: z.string(),
    cityId: z.string().transform(city =>  +city),
  })
  static readonly UPDATE = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    slug: z.string().min(8).max(512),
    imageUrl: z.string().optional(),
    address: z.string(),
    coordinate: z.string(),
    cityId: z.string().transform(city =>  +city),
  })
}

export type CreateStoreRequest = z.infer<typeof StoreValidation.CREATE>

export type UpdateStoreRequest = z.infer<typeof StoreValidation.UPDATE>