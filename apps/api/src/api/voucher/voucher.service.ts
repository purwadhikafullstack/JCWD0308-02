import { prisma } from '@/db.js';

export class VoucherService {
  static creaateVoucher = async (data: any) => {
    const voucher = await prisma.voucher.create({
      data,
    });
    return voucher;
  };

  static assignVoucherToUser = async (voucherId: string, userId: string) => {
    const userVoucher = await prisma.userVoucher.create({
      data: {
        voucherId,
        userId,
        expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      },
    });
    return userVoucher;
  };

  static getVouchers = async () => {
    const vouchers = await prisma.voucher.findMany();
    return vouchers;
  };

  static getUserVouchers = async (userId: string) => {
    const userVouchers = await prisma.userVoucher.findMany({
      where: { userId },
      include: { voucher: true },
    });
    return userVouchers;
  };
}
