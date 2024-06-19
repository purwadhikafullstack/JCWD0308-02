import { ZodType, z } from 'zod';

export class ProductValidation {
  static readonly createProduct: ZodType = z.object({
    title: z.string().min(1).max(256),
    slug: z.string().min(1).max(256),
    description: z.string().min(1),
    price: z.number().positive(),
    packPrice: z.number().positive(),
    discountPrice: z.number().positive().optional(),
    discountPackPrice: z.number().positive().optional(),
    packQuantity: z.number().positive(),
    bonus: z.number().optional(),
    minOrderItem: z.number().optional(),
    weight: z.number().positive(),
    weightPack: z.number().positive(),
    superAdminId: z.string().uuid(),
    status: z.enum(["DRAFT", "PUBLISHED", "INACTIVE", "SUSPENDED"]),
    categoryId: z.string().uuid(),
  });

  static readonly updateProduct: ZodType = z.object({
    title: z.string().min(1).max(256).optional(),
    slug: z.string().min(1).max(256).optional(),
    description: z.string().min(1).optional(),
    price: z.number().positive().optional(),
    packPrice: z.number().positive().optional(),
    discountPrice: z.number().positive().optional(),
    discountPackPrice: z.number().positive().optional(),
    packQuantity: z.number().positive().optional(),
    bonus: z.number().optional(),
    minOrderItem: z.number().optional(),
    weight: z.number().positive().optional(),
    weightPack: z.number().positive().optional(),
    superAdminId: z.string().uuid().optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "INACTIVE", "SUSPENDED"]).optional(),
    categoryId: z.string().uuid().optional(),
  });
}
