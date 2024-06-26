export interface Order {
  id: string;
  orderStatus: string;
  userId: string;
  courier: string;
  service: string;
  serviceDescription: string;
  estimation: string;
  note: string;
  paymentMethod: string;
  totalPrice: number;
  shippingCost: number;
  discountProducts: number;
  discountShippingCost: number;
  totalPayment: number;
  paymentPicture: string;
  storeId: string;
  storeAdminId: string;
  isDeleted: boolean;
  deletedAt: string;
  updatedAt: string;
  createdAt: string;
}