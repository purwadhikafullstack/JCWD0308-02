import { ICallback } from '@/types/index.js';
import { AddressService } from './address.service.js';
import { ResponseError } from '@/utils/error.response.js';
import { AuthHelper } from '../auth/auth.helper.js';

export class AddressController {
  createAddress: ICallback = async (req, res, next) => {
    try {
      console.log("BODY", req.body);

      const address = await AddressService.createAddress(req.body, res);
      AuthHelper.setAddressIdCookie(res, address.id)
      return res.status(201).json({ status: 'OK', address });
    } catch (error) {
      next(error);
    }
  };
  updateAddress: ICallback = async (req, res, next) => {
    try {
      console.log("BODY", req.body);

      const address = await AddressService.updateAddress(req.body, req, res);
      AuthHelper.setAddressIdCookie(res, address.id)
      return res.status(200).json({ status: 'OK', address });
    } catch (error) {
      next(error);
    }
  };
  deleteAddress: ICallback = async (req, res, next) => {
    try {
      const deletedAddress = await AddressService.deleteAddress(req.params.addressId, res)

      console.log({ deletedAddress });

      // res.end()
      return res.status(200).json({ status: 'OK', message: `${deletedAddress.labelAddress} address has been deleted!`, deletedAddress })
    } catch (error) {
      next(error)
    }
  }
  getAllAddress: ICallback = async (req, res, next) => {
    try {
      const addressList = await AddressService.getAllAddress(res.locals.user?.id!);
      return res.status(200).json({ status: 'OK', addressList });
    } catch (error) {
      next(error);
    }
  };
  getSelectedAddress: ICallback = async (req, res, next) => {
    try {
      const address = await AddressService.getSelectedAddress(res);
      return res.status(200).json({ status: 'OK', address });
    } catch (error) {
      next(error);
    }
  };
}
