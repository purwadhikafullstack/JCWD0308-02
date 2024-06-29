import { prisma } from '@/db.js';
import { ICallback } from '@/types/index.js';

export class ProvinceController {
  getProvinces: ICallback = async (req, res, next) => {
    try {
      const provinces = await prisma.province.findMany()
      return res.status(201).json({ status: 'OK', provinces });
    } catch (error) {
      next(error);
    }
  };
}
