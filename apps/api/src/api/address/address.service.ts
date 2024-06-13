import { prisma } from '@/db.js';
import { ResponseError } from '@/utils/error.response.js';
import { AddressValidation } from './address.validation.js';
import { Validation } from '@/utils/validation.js';
import { Response } from 'express';
export class AddressService {
  static addAddress = async (req: Request, res: Response) => {
    const addressRequest: any = Validation.validate(
      AddressValidation.ADDRESS,
      req,
    );

    const user = await prisma.user.findUnique({
      where: { id: res.locals.user?.id },
      select: { id: true, status: true, role: true },
    });
    const address = await prisma.userAddress.create({
      data: {
        userId: user?.id,
        isMainAddress: true,
        address: addressRequest.address,
        cityId: addressRequest.cityId,
        coordinate: addressRequest.coordinate,
      } as any,
    });
    return address;
  };

  static getAddress = async (addressId: string) => {
    const stock = await prisma.userAddress.findUnique({
      where: { id: addressId },
    });
    if (!stock) {
      throw new ResponseError(404, 'Stock not found!');
    }
  };
}
