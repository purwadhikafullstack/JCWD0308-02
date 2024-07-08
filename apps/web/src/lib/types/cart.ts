export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  updatedAt: string;
  createdAt: string;
}

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
  resetDiscountAt?: string;
  updatedAt: string;
  createdAt: string;
  images: ProductImage[];
}

export interface Stock {
  id: string;
  productId: string;
  storeId: string;
  amount: number;
  updatedAt: string;
  createdAt: string;
  product: Product;
}

export interface User {
  id: string;
  accountType: string;
  email: string;
  contactEmail?: string;
  password: string;
  displayName: string;
  avatarUrl: string;
  role: string;
  status: string;
  referralCode: string;
  registerCode?: string;
  resetSuspendCode?: string;
  resetSuspendAt?: string;
  updatedAt: string;
  createdAt: string;
}

export interface CartItemType {
  productId: string;
  id: string;
  orderItemType: string;
  isChecked: boolean;
  userId: string;
  orderId?: string;
  stockId: string;
  quantity: number;
  isPack: boolean;
  bonus?: number;
  isDeleted: boolean;
  deletedAt?: string;
  updatedAt: string;
  createdAt: string;
  stock: Stock;
  user: User;
}

export interface CartRequestType {
  productId: string;
  quantity: number;
  isPack: boolean;
  addressId: string;
  stockId?: string;
}
