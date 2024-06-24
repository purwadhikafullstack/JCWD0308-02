export interface Product {
    id: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    packPrice: number;
    images: { imageUrl: string }[]; // Ensure images is an array of objects with imageUrl property
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
    createdAt: string;
    updatedAt: string;
}
