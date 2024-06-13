import { prisma } from '@/db.js';
import { ResponseError } from '@/utils/error.response.js';

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
}
