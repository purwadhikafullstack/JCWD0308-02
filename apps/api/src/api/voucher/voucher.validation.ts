import { DiscountType, VoucherType } from '@prisma/client';
import { z } from 'zod';

export class VoucherValidation {
  static createVoucher = z.object({
    name: z.string().min(1),
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
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
    }, z.date()),
    imageUrl: z.string().optional(),
  });

  static updateVoucher = z.object({
    name: z.string().min(1).optional(),
    code: z.string().optional(),
    description: z.string().optional(),
    isClaimable: z.boolean().default(false).optional(),
    isPrivate: z.boolean().default(false).optional(),
    voucherType: z.nativeEnum(VoucherType).optional(),
    discountType: z.nativeEnum(DiscountType).optional(),
    fixedDiscount: z.number().optional(),
    discount: z.number().optional(),
    stock: z.number().default(0).optional(),
    minOrderPrice: z.number().optional(),
    minOrderItem: z.number().optional(),
    expiresAt: z.preprocess((arg) => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
    }, z.date()).optional(),
    imageUrl: z.string().optional(),
  });
}
