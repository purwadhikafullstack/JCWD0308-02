export interface CartRequest {
  addressId?: string;
  stockId: string;
  quantity: number;
  isPack: boolean;
  productId: string;
}
export interface UpdateCartRequest {
  stockId: string | null;
  quantity: number | null;
}
