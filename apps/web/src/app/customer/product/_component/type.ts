export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  packPrice: number;
  discountPrice?: number;
  discountPackPrice?: number;
  packQuantity: number;
  bonus?: number;
  weight: number;
  weightPack: number;
  minOrderItem?: number;
  superAdminId: string;
  status: string;
  categoryId: string;
  resetDiscountCode?: string;
  resetDiscountAt?: Date;
  updatedAt: Date;
  createdAt: Date;
}
