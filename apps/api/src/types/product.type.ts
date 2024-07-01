import { Status } from "@prisma/client";

export interface ProductRequest {
  title: string;
  slug: string;
  description: string;
  price: number;
  packPrice: number;
  discountPrice?: number;
  discountPackPrice?: number;
  packQuantity: number;
  bonus?: number;
  minOrderItem?: number;
  weight: number;
  weightPack: number;
  superAdminId: string;
  status: Status;
  categoryId: string;
  imageUrls?: string[];
}

export const ProductFields = {
  id: true,
  title: true,
  slug: true,
  description: true,
  price: true,
  packPrice: true,
  discountPrice: true || null,
  discountPackPrice: true || null,
  packQuantity: true,
  bonus: true || null,
  minOrderItem: true || null,
  weight: true,
  weightPack: true,
  superAdminId: true,
  status: true,
  categoryId: true,
  resetDiscountCode: true || null,
  resetDiscountAt: true || null,
  updatedAt: true,
  createdAt: true,
  images: true || null,
};

export interface ProductUpdateRequest {
  title?: string;
  slug?: string;
  description?: string;
  price?: number;
  packPrice?: number;
  discountPrice?: number | null;
  discountPackPrice?: number | null;
  packQuantity?: number;
  bonus?: number | null;
  minOrderItem?: number | null;
  weight?: number;
  weightPack?: number;
  superAdminId?: string;
  status?: Status;
  categoryId?: string;
  imageUrls?: string[];
  imagesToDelete?: string[];
}
