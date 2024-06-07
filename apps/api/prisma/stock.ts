import { Prisma } from "@prisma/client";

export const stocks: Prisma.StockCreateManyInput[] = [
  // Stok untuk produk 1
  {
    productId: 1,
    storeId: 1,
    amount: 200
  },
  {
    productId: 1,
    storeId: 2,
    amount: 300
  },
  {
    productId: 1,
    storeId: 3,
    amount: 100
  },
  // Stok untuk produk 2
  {
    productId: 2,
    storeId: 1,
    amount: 500
  },
  {
    productId: 2,
    storeId: 2,
    amount: 150
  },
  {
    productId: 2,
    storeId: 3,
    amount: 250
  },
  // Stok untuk produk 3
  {
    productId: 3,
    storeId: 1,
    amount: 400
  },
  {
    productId: 3,
    storeId: 2,
    amount: 300
  },
  {
    productId: 3,
    storeId: 3,
    amount: 200
  },
  // Stok untuk produk 4
  {
    productId: 4,
    storeId: 1,
    amount: 600
  },
  {
    productId: 4,
    storeId: 2,
    amount: 500
  },
  {
    productId: 4,
    storeId: 3,
    amount: 400
  },
  // Stok untuk produk 5
  {
    productId: 5,
    storeId: 1,
    amount: 700
  },
  {
    productId: 5,
    storeId: 2,
    amount: 600
  },
  {
    productId: 5,
    storeId: 3,
    amount: 500
  },
  // Stok untuk produk 6
  {
    productId: 6,
    storeId: 1,
    amount: 300
  },
  {
    productId: 6,
    storeId: 2,
    amount: 400
  },
  {
    productId: 6,
    storeId: 3,
    amount: 200
  },
  // Stok untuk produk 7
  {
    productId: 7,
    storeId: 1,
    amount: 250
  },
  {
    productId: 7,
    storeId: 2,
    amount: 150
  }
];
