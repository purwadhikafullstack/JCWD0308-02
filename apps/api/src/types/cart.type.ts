export interface CartRequest {
  stockId: string;
  quantity: number;
  isPack: boolean;
}
export interface UpdateCartRequest {
  stockId: string | null;
  quantity: number | null;
}
