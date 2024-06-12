import { ICallback } from '@/types/index.js';
import { AddressService } from './address.service.js';
import { ResponseError } from '@/utils/error.response.js';

export class AddressController {
  addAddress: ICallback = async (req, res, next) => {
    try {
      const address = await AddressService.addAddress(req.body, res);
      return res.status(201).json({ status: 'OK', data: address });
    } catch (error) {
      next(error);
    }
  };
}
