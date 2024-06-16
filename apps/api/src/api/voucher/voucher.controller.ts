import { ICallback } from '@/types/index.js';
import { VoucherService } from './voucher.service.js';

export class VoucherController {
  createVoucher: ICallback = async (req, res, next) => {
    try {
      const voucher = await VoucherService.creaateVoucher(req.body);
      res.status(201).json(voucher);
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

  getVoucher: ICallback = async (req, res, next) => {
    try {
      const vouchers = await VoucherService.getVouchers();
      res.status(200).json(vouchers);
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
