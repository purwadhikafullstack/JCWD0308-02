export interface CartRequest {
  stockId: string;
  quantity: number;
  isPack: boolean;
}
export interface UpdateCartRequest {
  cartItemId: string | null;
  stockId: string | null;
  quantity?: number | null;
  isPack: boolean;
}
