import { prisma } from '@/db.js';
import { ResponseError } from '@/utils/error.response.js';
import { AddressValidation, CreateAddressRequest } from './address.validation.js';
import { Validation } from '@/utils/validation.js';
import { Request, Response } from 'express';
import { AuthHelper } from '../auth/auth.helper.js';
export class AddressService {
  static createAddress = async (req: CreateAddressRequest, res: Response) => {

    if (!req.userId) {
      req.userId = res.locals?.user?.id!;
    }

    const addressRequest = Validation.validate(
      AddressValidation.CREATE,
      req,
    );

    const address = await prisma.userAddress.create({
      data: {
        ...addressRequest
      },
    });

    if (address.isMainAddress) {
      await prisma.userAddress.updateMany({ where: { NOT: { id: address.id } }, data: { isMainAddress: false } })
    }

    return address;
  };

  static getAllAddress = async (userId: string) => {
    const userAddressList = await prisma.userAddress.findMany({
      where: { userId },
      include: {
        city: true
      }
    });
    return userAddressList;
  };

  static getSelectedAddress = async (res: Response) => {
    const addressId = res.locals.address?.id;
    if (!addressId) {
      throw new ResponseError(404, 'Stock not found!');
    }
    const address = await prisma.userAddress.findUnique({
      where: { id: addressId },
      include: {
        city: true
      }
    });
    if (!address) {
      throw new ResponseError(404, 'Stock not found!');
    }
    return address;
  };

  static updateAddress = async (body: CreateAddressRequest, req: Request, res: Response) => {

    if (!body.userId) {
      body.userId = res.locals?.user?.id!;
    }

    const addressRequest = Validation.validate(
      AddressValidation.CREATE,
      body,
    );

    const address = await prisma.userAddress.update({
      where: { id: req.params.addressId },
      data: {
        ...addressRequest
      },
    });

    if (address.isMainAddress) {
      await prisma.userAddress.updateMany({ where: { NOT: { id: address.id } }, data: { isMainAddress: false } })
    }

    return address;
  };


  static deleteAddress = async (addressId: string, res: Response) => {
    const existingAddress = await prisma.userAddress.findUnique({
      where: {
        id: addressId
      }
    })

    if (!existingAddress) throw new ResponseError(400, "Address is not found!")

    const deletedAddress = await prisma.userAddress.delete({ where: { id: addressId } })

    if (deletedAddress.id === res.locals.address?.id) {
      const addressFallback = await prisma.userAddress.findFirst()

      AuthHelper.setAddressIdCookie(res, addressFallback?.id!)
    }

    return deletedAddress;
  };
}
