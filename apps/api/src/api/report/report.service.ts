import { prisma } from '@/db.js';
import { ResponseError } from '@/utils/error.response.js';

export class ReportService {
  static async getStockMutation(storeId: string, page: number, perPage: number, yearMonth: string, productSlug: string, storeSlug: string) {
    const whereClause = this.buildWhereClause(storeId, yearMonth, productSlug, storeSlug);
    const mutations = await prisma.stockMutation.findMany({
      where: whereClause,
      include: { stock: { include: { product: true, store: true } } },
      orderBy: { createdAt: 'desc' },
      skip: perPage * (page - 1),
      take: perPage,
    });
    const totalCount = await prisma.stockMutation.count({ where: whereClause });
    return { mutations, totalCount };
  }

  static async getStockMutationById(storeAdminId: string, page: number, perPage: number, yearMonth: string, productSlug: string, storeSlug: string) {
    const storeAdmin = await prisma.storeAdmin.findUnique({
      where: { storeAdminId: storeAdminId },
      select: { storeId: true },
    });

    if (!storeAdmin) {
      throw new ResponseError(404, `Store Admin with id ${storeAdminId} not found`);
    }

    const storeId = storeAdmin.storeId;
    return this.getStockMutation(storeId, page, perPage, yearMonth, productSlug, storeSlug);
  }

  private static buildWhereClause(storeId: string, yearMonth: string, productSlug: string, storeSlug: string) {
    const where: any = {};
    if (storeId) {
      where.stock = { storeId: storeId };
    }
    if (yearMonth) {
      const [year, month] = yearMonth.split('-').map(Number);
      if (!isNaN(year) && !isNaN(month)) {
        where.createdAt = {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        };
      } else {
        throw new ResponseError(400, `Invalid yearMonth format: ${yearMonth}`);
      }
    }
    if (productSlug) {
      where.stock = { ...where.stock, product: { slug: productSlug } };
    }
    if (storeSlug) {
      where.stock = { ...where.stock, store: { slug: storeSlug } };
    }
    return where;
  }
}
