export type StockRequest = {
    productId: string;
    storeId: string;
    amount: number;
    adminId: string;
  };
  
  export type StockUpdateRequest = Partial<StockRequest>;
  