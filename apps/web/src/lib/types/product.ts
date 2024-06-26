export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  packPrice: number;
  images: ProductImage[];
  discountPrice?: number;
  discountPackPrice?: number;
  packQuantity: number;
  bonus?: number;
  weight: number;
  weightPack: number;
  minOrderItem?: number;
  superAdminId: string;
  status: 'DRAFT' | 'PUBLISHED' | 'INACTIVE' | 'SUSPENDED';
  categoryId: string;
  resetDiscountCode?: string;
  resetDiscountAt?: Date;
  updatedAt: Date;
  createdAt: Date;  
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  updatedAt: string;
  createdAt: string;
}
