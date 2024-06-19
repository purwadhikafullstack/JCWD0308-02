import { ZodType, z } from 'zod';

export class CategoryValidation {
  static readonly createCategory: ZodType = z.object({
    name: z.string().min(1).max(64),
  });

  static readonly updateCategory: ZodType = z.object({
    name: z.string().min(1).max(64).optional(),
  });
}
