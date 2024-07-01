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
  mutations: Mutation[];
}

export interface Mutation {
  id: string;
  stockId: string;
  mutationType: string;
  amount: number;
  description: string;
  adminId: string;
  orderId: string | null;
  updatedAt: string;
  createdAt: string;
}

