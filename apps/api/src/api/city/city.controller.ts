import { prisma } from '@/db.js';
import { ICallback } from '@/types/index.js';

export class CityController {
  getCities: ICallback = async (req, res, next) => {
    const filter: any = {}
    if (Number(req.query.provinceId) && Number(req.query.provinceId) <= 34) {
      filter.provinceId = +req.query.provinceId! 
    }
    try {
      const cities = await prisma.city.findMany({ where: { ...filter } })
      return res.status(201).json({ status: 'OK', cities });
    } catch (error) {
      next(error);
    }
  };
}
