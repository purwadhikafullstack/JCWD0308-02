export interface StockMutation {
  id: string;
  stockId: string;
  mutationType: string;
  amount: number;
  description?: string | null;
  adminId?: string | null;
  orderId?: string | null;
  updatedAt: Date;
  createdAt: Date;
  stock: {
    product: {
      title: string
    }
  }
}
