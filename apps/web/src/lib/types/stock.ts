export interface Stock {
    id: string;
    productId: string;
    storeId: string;
    amount: number;
    description: string;
    updatedAt: string;
    createdAt: string;
    product: {
      title: string;
    };
    store: {
      name: string;
    };
  }