import { z } from 'zod';
import { DiscountType, VoucherType } from '@prisma/client';

export const VoucherValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().optional(),
  description: z.string().optional(),
  isClaimable: z.boolean().default(false),
  isPrivate: z.boolean().default(false),
  voucherType: z.nativeEnum(VoucherType),
  discountType: z.nativeEnum(DiscountType),
  fixedDiscount: z.number().optional(),
  discount: z.number().optional(),
  stock: z.number().default(0),
  minOrderPrice: z.number().optional(),
  minOrderItem: z.number().optional(),
  expiresAt: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
  }, z.date()),
  image: z.any().optional(),
});
