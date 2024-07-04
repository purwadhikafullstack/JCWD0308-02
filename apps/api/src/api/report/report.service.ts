import { prisma } from '@/db.js';
import { ResponseError } from '@/utils/error.response.js';
export class ReportService {
  static getStockMutation = async (
    storeId: any,
    page: number,
    perPage: number,
  ) => {
    const mutations = await prisma.stockMutation.findMany({
      where: { stock: { storeId: storeId } },
      include: { stock: true },
      orderBy: { createdAt: 'desc' },
      skip: perPage * (page - 1),
      take: perPage,
    });
    const totalCount = await prisma.stockMutation.count({
      where: { stock: { storeId: storeId } },
    });
    return { mutations, totalCount };
  };
  static getStockMutationById = async (
    storeAdminId: string,
    page: number,
    perPage: number,
  ) => {
    const storeAdmin = await prisma.storeAdmin.findUnique({
      where: { storeAdminId: storeAdminId },
      select: { storeId: true },
    });

    if (!storeAdmin) {
      throw new ResponseError(
        404,
        `Store Admin with id ${storeAdminId} not found`,
      );
    }

    const storeId = storeAdmin.storeId;

    const mutations = await prisma.stockMutation.findMany({
      where: { stock: { storeId: storeId } },
      include: { stock: true },
      orderBy: { createdAt: 'desc' },
      skip: perPage * (page - 1),
      take: perPage,
    });

    const totalCount = await prisma.stockMutation.count({
      where: { stock: { storeId: storeId } },
    });

    return { mutations, totalCount };
  };
  static getStoreAdminIdByStoreId = async (storeId: any) => {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { storeAdmins: { select: { storeAdminId: true } } },
    });

    if (!store) {
      throw new ResponseError(404, `Store with id ${storeId} not found`);
    }
    console.log('Store Admin ID:', store.storeAdmins[0].storeAdminId);
    return store.storeAdmins[0].storeAdminId;
  };
}
