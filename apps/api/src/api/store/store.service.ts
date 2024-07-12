import { prisma } from '@/db.js';
import { Validation } from '@/utils/validation.js';
import { Request, Response } from 'express';
import { CreateStoreRequest, StoreValidation, UpdateStoreRequest } from './store.validation.js';
import { ResponseError } from '@/utils/error.response.js';
import { API_URL } from '@/config.js';
import { UserFields } from '@/types/user.type.js';
import { deleteFile, getBaseUrl } from '@/utils/file.js';

export class StoreService {
  static getStore = async (storeId: string) => {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        storeAdmins: true,
        stocks: { include: { product: true } },
        orders: true,
        City: true
      },
    });
    return store;
  };

  static getStoreAdmin = async (storeId: string) => {
    const store = await prisma.storeAdmin.findMany({
      where: { storeId: storeId },
      include: {
        storeAdmin: {
          select: {
            ...UserFields
          }
        }
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

  static getStores = async (page: number, limit: number, filters: any, res: Response) => {
    const { search, storeId, status, ...filterOptions } = filters;
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { slug: { contains: search } },
        { City: { name: { contains: search } } },
      ];
    }

    if (status) where.status = status

    for (const [key, value] of Object.entries(filterOptions)) {
      if (value) {
        where[key] = value;
      }
    }

    const total = await prisma.store.count({
      where: {
        ...where
      }
    });

    const stores = await prisma.store.findMany({
      where,
      include: {
        City: true
      },
      orderBy: {
        createdAt: 'asc'
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { total, page, limit, stores, totalPage: Math.ceil(total / limit) };
  };

  static getSeletedStore = async (adminId: string) => {
    return await prisma.store.findFirst({
      where: {
        OR: [{
          superAdminId: adminId
        }, {
          storeAdmins: {
            some: { storeAdminId: adminId },
          }
        }]
      }
    })
  }

  static createStore = async (req: Request, res: Response) => {
    if (req.file) {
      req.body.imageUrl = `${API_URL}/api/public/images/${req.file.filename}`
    }
    const storeData = Validation.validate(StoreValidation.CREATE, req.body as CreateStoreRequest)

    const existingStore = await prisma.store.findFirst({
      where: {
        OR: [{ name: storeData.name }, { slug: storeData.slug }]
      }
    })

    if (existingStore) throw new ResponseError(400, "Store name or Store slug is already used!")

    const newStore = await prisma.store.create({
      data: { ...storeData, superAdminId: res.locals.user?.id! },
    })

    return newStore
  }

  static updateStore = async (req: Request, res: Response) => {
    if (req.file) {
      req.body.imageUrl = `${API_URL}/api/public/images/${req.file.filename}`
    }

    req.body.id = req.params.storeId

    const storeData = Validation.validate(StoreValidation.UPDATE, req.body as UpdateStoreRequest)

    const existingStore = await prisma.store.findUnique({
      where: {
        id: storeData.id
      }
    })

    if (!existingStore) throw new ResponseError(400, "Store is not found!")

    
      if (getBaseUrl(API_URL) === getBaseUrl(existingStore?.imageUrl!) && storeData.imageUrl !== existingStore?.imageUrl ) {
        deleteFile(existingStore?.imageUrl!)
      }

    const updatedStore = await prisma.store.update({
      where: {
        id: storeData.id
      },
      data: { ...storeData }
    })

    return updatedStore
  }

  static deleteStore = async (storeId: string, res: Response) => {
    const existingStore = await prisma.store.findUnique({
      where: {
        id: storeId
      }
    })

    if (!existingStore) throw new ResponseError(400, "Store is not found!")

    const deletedStore = await prisma.store.delete({ where: { id: storeId } })

    if (deletedStore.id === res.locals.store?.id) {

      const storeFallback = await prisma.store.findFirst()

      return { deletedStore, storeFallback }
    }

    return { deletedStore }
  }
}
