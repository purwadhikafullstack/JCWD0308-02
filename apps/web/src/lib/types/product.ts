export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  packPrice: number;
  images: { imageUrl: string }[];
  discountPrice?: number;
  discountPackPrice?: number;
  packQuantity?: number;
  bonus?: number;
  minOrderItem?: number;
  weight: number;
  weightPack: number;
  superAdminId: string;
  status: 'DRAFT' | 'PUBLISHED' | 'INACTIVE' | 'SUSPENDED';
  categoryId: string;
  resetDiscountCode?: string;
  resetDiscountAt?: Date;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  updatedAt: string;
  createdAt: string;
}
