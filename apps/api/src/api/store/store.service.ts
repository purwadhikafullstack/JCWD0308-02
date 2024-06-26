import { prisma } from '@/db.js';

export class StoreService {
  static getStore = async (storeId: string) => {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        storeAdmins: true,
        stocks: { include: { product: true } },
        orders: true,
      },
    });
    return store;
  };

  static getAllStores = async () => {
    const stores = await prisma.store.findMany({
      include: {
        storeAdmins: true,
        stocks: { include: { product: true } },
        orders: true,
      },
    });
    return stores;
  };
}
