import { prisma } from '@/db.js';
import { Validation } from '@/utils/validation.js';
import { VoucherValidation } from './voucher.validation.js';

export class VoucherService {
  static async getVouchersAdmin(page: number, limit: number, filters: any) {
    const where: any = {};
    if (filters.search) {
      where.name = { contains: filters.search };
      delete filters.search;
    }
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        where[key] = value;
      }
    }

    const total = await prisma.voucher.count({ where });
    const vouchers = await prisma.voucher.findMany({
      where: {
        isPrivate: false, isClaimable: true,
        ...where
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        superAdmin: true,
        storeAdmin: true,
        store: true,
      },
    });

    return { total, page, limit, vouchers };
  }

  static async getVouchers(page: number, limit: number, filters: any) {
    const where: any = {};
    if (filters.search) {
      where.name = { contains: filters.search };
      delete filters.search;
    }
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        where[key] = value;
      }
    }

    const total = await prisma.voucher.count({ where });
    const vouchers = await prisma.voucher.findMany({
      where: {
        isPrivate: false, isClaimable: true,
        ...where
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        superAdmin: true,
        storeAdmin: true,
        store: true,
      },
    });

    return { total, page, limit, vouchers };
  }

  static async getVoucherById(id: string) {
    const voucher = await prisma.voucher.findUnique({
      where: { id },
      include: {
        superAdmin: true,
        storeAdmin: true,
        store: true,
      },
    });
    return voucher;
  }

  static async createVoucher(data: any, userId: string, imageUrl?: string) {
    const validatedData = Validation.validate(
      VoucherValidation.createVoucher,
      data,
    );
    const voucherData = {
      ...validatedData,
      imageUrl,
      superAdminId: data.superAdminId || null,
      storeAdminId: data.storeAdminId || null,
      storeId: data.storeId || null,
    };

    const voucher = await prisma.voucher.create({ data: voucherData });
    return voucher;
  }

  static async updateVoucher(
    id: string,
    data: any,
    userId: string,
    imageUrl?: string,
  ) {
    const validatedData = Validation.validate(
      VoucherValidation.updateVoucher,
      data,
    );
    const voucherData = {
      ...validatedData,
      imageUrl,
      superAdminId: data.superAdminId || null,
      storeAdminId: data.storeAdminId || null,
      storeId: data.storeId || null,
    };

    const voucher = await prisma.voucher.update({
      where: { id },
      data: voucherData,
    });
    return voucher;
  }

  static async deleteVoucher(id: string) {
    await prisma.voucher.delete({ where: { id } });
  }

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

  static getUserVouchers = async (userId: string) => {
    const userVouchers = await prisma.userVoucher.findMany({
      where: { userId },
      include: { voucher: true },
    });
    return userVouchers;
  };
}
