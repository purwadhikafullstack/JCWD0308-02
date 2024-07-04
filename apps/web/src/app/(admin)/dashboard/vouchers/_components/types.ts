export interface Voucher {
  id: string;
  name: string;
  code: string;
  description: string;
  isClaimable: boolean;
  isPrivate: boolean;
  voucherType: 'PRODUCT' | 'SHIPPING_COST';
  discountType: 'FIXED_DISCOUNT' | 'DISCOUNT';
  fixedDiscount: number;
  discount: number;
  stock: number;
  minOrderPrice: number;
  minOrderItem: number;
  expiresAt: Date;
  imageUrl: string | null;
}
