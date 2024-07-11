export interface CartRequest {
  addressId?: any;
  stockId: string;
  quantity: number;
  isPack: boolean;
  productId: string;
}
export interface UpdateCartRequest {
  // productId: any;
  // addressId: any;
  cartItemId: string | null;
  stockId: string | null;
  quantity?: number | null;
}
