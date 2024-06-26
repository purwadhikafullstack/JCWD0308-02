import { prisma } from '@/db.js';
import { Validation } from '@/utils/validation.js';
import { Request, Response } from 'express';
import { CreateStoreRequest, StoreValidation, UpdateStoreRequest } from './store.validation.js';
import { ResponseError } from '@/utils/error.response.js';
import { API_URL } from '@/config.js';
import { UserFields } from '@/types/user.type.js';

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

  static getStores = async () => {
    const stores = await prisma.store.findMany({
      include: {
        City: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    return stores;
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
      console.log(req.file, 'check file');
      req.body.imageUrl = `${API_URL}/public/images/${req.file.filename}`
    }
    const storeData = Validation.validate(StoreValidation.CREATE, req.body as CreateStoreRequest)
    console.log(storeData);

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
      console.log(req.file, 'check file');
      req.body.imageUrl = `${API_URL}/public/images/${req.file.filename}`
    }

    req.body.id = req.params.storeId

    console.log('BODY: ', req.body);


    const storeData = Validation.validate(StoreValidation.UPDATE, req.body as UpdateStoreRequest)
    console.log(storeData);

    const existingStore = await prisma.store.findUnique({
      where: {
        id: storeData.id
      }
    })

    if (!existingStore) throw new ResponseError(400, "Store is not found!")

    const updatedStore = await prisma.store.update({
      where: {
        id: storeData.id
      },
      data: { ...storeData }
    })

    return updatedStore
  }
}
