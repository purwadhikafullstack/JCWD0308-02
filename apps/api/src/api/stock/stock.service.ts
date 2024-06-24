import { prisma } from '@/db.js';
import { ResponseError } from '@/utils/error.response.js';
import { findStoresInRange } from '../distance/distance.service.js';

export class StockService {
  static addStock = async (
    productId: string,
    storeId: string,
    amount: number,
  ) => {
    const stock = await prisma.stock.create({
      data: {
        productId,
        storeId,
        amount,
      },
    });
    return stock;
  };

  static getStock = async (stockId: string) => {
    const stock = await prisma.stock.findUnique({
      where: { id: stockId },
    });
    if (!stock) {
      throw new ResponseError(404, 'Stock not found!');
    }
  };
  static postStockId = async (
    productId: string,
    addressId: string,
    userId: any,
  ) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { addresses: true },
    });

    if (!user) throw new ResponseError(401, 'Unauthorized');

    const userAddress = user.addresses.find(
      (address: any) => address.id === addressId,
    );

    if (!userAddress) throw new ResponseError(401, 'Address not found!');

    const nearbyStore = await findStoresInRange(userAddress.coordinate, 20);

    let stock;
    for (const store of nearbyStore) {
      stock = await prisma.stock.findFirst({
        where: { productId, storeId: store.id },
      });
      if (stock) break;
    }

    if (!stock) {
      const centralStore = await prisma.store.findUnique({
        where: { slug: 'grosirun-pusat' },
      });
      if (centralStore) {
        stock = await prisma.stock.findFirst({
          where: {
            productId,
            storeId: centralStore.id,
          },
        });
      }
    }

    if (!stock) throw new ResponseError(400, 'Stock not found!');

    return stock.id;
  };
}
