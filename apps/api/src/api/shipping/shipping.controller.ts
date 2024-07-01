import { ICallback } from '@/types/index.js';
import { ShippingService } from './shipping.service.js';

export class ShippingController {
  calculateShippingCost: ICallback = async (req, res, next) => {
    const { origin, destination, weight, courier } = req.body;
    try {
      const { cost, estimation } = await ShippingService.calculateShippingCost(
        origin,
        destination,
        weight,
        courier,
      );
      res.json({ cost, estimation });
    } catch (error) {
      next(error);
    }
  };
}
