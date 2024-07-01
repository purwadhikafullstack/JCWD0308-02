import { DiscountType, VoucherType } from '@prisma/client';
import { z } from 'zod';

export const VoucherRequest = z.object({
    name: z.string().min(1),
    code: z.string().optional(),
    description: z.string().optional(),
    superAdminId: z.string().uuid().optional(),
    storeAdminId: z.string().uuid().optional(),
    storeId: z.string().uuid().optional(),
    isClaimable: z.boolean().default(false),
    isPrivate: z.boolean().default(false),
    voucherType: z.nativeEnum(VoucherType),
    discountType: z.nativeEnum(DiscountType),
    fixedDiscount: z.number().optional(),
    discount: z.number().optional(),
    stock: z.number().default(0),
    minOrderPrice: z.number().optional(),
    minOrderItem: z.number().optional(),
    expiresAt: z.date(),
    imageUrl: z.string().optional(),
  });
  
  export const VoucherUpdateRequest = VoucherRequest.partial();

export const VoucherFields = {
  id: true,
  name: true,
  code: true,
  description: true,
  superAdminId: true,
  storeAdminId: true,
  storeId: true,
  isClaimable: true,
  isPrivate: true,
  voucherType: true,
  discountType: true,
  fixedDiscount: true,
  discount: true,
  stock: true,
  minOrderPrice: true,
  minOrderItem: true,
  expiresCode: true,
  expiresAt: true,
  updatedAt: true,
  createdAt: true,
  imageUrl: true,
};


