import { ICallback } from '@/types/index.js';
import { VoucherService } from './voucher.service.js';
import { User } from 'lucia';

export class VoucherController {
  
  getVouchers: ICallback = async (req, res, next) => {
    try {
      const { page = 1, limit = 10, search, ...filters } = req.query;
      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);

      const vouchers = await VoucherService.getVouchers(pageNumber, limitNumber, { ...filters, search });
      res.status(200).json(vouchers);
    } catch (error) {
      next(error);
    }
  };

  getVoucherById: ICallback = async (req, res, next) => {
    try {
      const { id } = req.params;
      const voucher = await VoucherService.getVoucherById(id);
      if (!voucher) {
        return res.status(404).json({ message: 'Voucher not found' });
      }
      res.status(200).json(voucher);
    } catch (error) {
      next(error);
    }
  };

  createVoucher: ICallback = async (req, res, next) => {
    try {
      const user = res.locals.user as User;
      const { superAdminId, storeAdminId, storeId, ...voucherData } = req.body;
  
      const parsedVoucherData = {
        ...voucherData,
        isClaimable: JSON.parse(voucherData.isClaimable),
        isPrivate: JSON.parse(voucherData.isPrivate),
        fixedDiscount: Number(voucherData.fixedDiscount),
        discount: Number(voucherData.discount),
        stock: Number(voucherData.stock),
        minOrderPrice: Number(voucherData.minOrderPrice),
        minOrderItem: Number(voucherData.minOrderItem),
      };
  
      const file = req.file as Express.Multer.File | undefined;
      const imageUrl = file ? `/public/${file.filename}` : undefined;
  
      const voucher = await VoucherService.createVoucher(
        {
          ...parsedVoucherData,
          superAdminId: user.role === 'SUPER_ADMIN' ? user.id : superAdminId,
          storeAdminId: user.role === 'STORE_ADMIN' ? user.id : storeAdminId,
          storeId,
        },
        user.id,
        imageUrl
      );
  
      res.status(201).json({ status: 'OK', message: 'Voucher Created Successfully', voucher });
    } catch (error) {
      next(error);
    }
  };
  

  updateVoucher: ICallback = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = res.locals.user as User;
      const { superAdminId, storeAdminId, storeId, ...voucherData } = req.body;
  
      const parsedVoucherData = {
        ...voucherData,
        isClaimable: JSON.parse(voucherData.isClaimable),
        isPrivate: JSON.parse(voucherData.isPrivate),
        fixedDiscount: Number(voucherData.fixedDiscount),
        discount: Number(voucherData.discount),
        stock: Number(voucherData.stock),
        minOrderPrice: Number(voucherData.minOrderPrice),
        minOrderItem: Number(voucherData.minOrderItem),
      };

      const file = req.file as Express.Multer.File | undefined;
      const imageUrl = file ? `/public/${file.filename}` : undefined;

      const voucher = await VoucherService.updateVoucher(
        id,
        {
          ...parsedVoucherData,
          superAdminId: user.role === 'SUPER_ADMIN' ? user.id : superAdminId,
          storeAdminId: user.role === 'STORE_ADMIN' ? user.id : storeAdminId,
          storeId,
        },
        user.id,
        imageUrl
      );

      res.status(200).json({ status: 'OK', message: 'Voucher Updated Successfully', voucher });
    } catch (error) {
      next(error);
    }
  };

  deleteVoucher: ICallback = async (req, res, next) => {
    try {
      const { id } = req.params;
      await VoucherService.deleteVoucher(id);
      res.status(200).json({ status: 'OK', message: 'Voucher Deleted Successfully' });
    } catch (error) {
      next(error);
    }
  };

  assignVoucherToUser: ICallback = async (req, res, next) => {
    try {
      const { voucherId, userId } = req.body;
      const userVoucher = await VoucherService.assignVoucherToUser(
        voucherId,
        userId,
      );
      res.status(201).json(userVoucher);
    } catch (error) {
      next(error);
    }
  };

  getUserVouchers: ICallback = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const userVouchers = await VoucherService.getUserVouchers(userId);
      res.status(200).json(userVouchers);
    } catch (error) {
      next(error);
    }
  };
}
