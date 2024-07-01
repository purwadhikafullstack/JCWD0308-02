export interface Order {
  orderItems: any;
  data: any;
  id: string;
  orderStatus: string;
  userId: string;
  courier: string;
  service: string;
  serviceDescription: string;
  estimation: string;
  note: string;
  paymentMethod: string;
  paymentLink: string;
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

export interface OrderStatusMap {
  awaiting_payment: Order[];
  awaiting_confirmation: Order[];
  process: Order[];
  shipping: Order[];
  delivered: Order[];
  confirmed: Order[];
  cancelled: Order[];
}
