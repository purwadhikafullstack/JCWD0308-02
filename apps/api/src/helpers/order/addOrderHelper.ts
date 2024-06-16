import { calculateShippingCost } from '@/api/shipping/shipping.service.js';
import { prisma } from '@/db.js';
import {
  OrderRequest,
  getCourierType,
  mapCourierTypeToRajaOngkir,
} from '@/types/order.type.js';
import { ResponseError } from '@/utils/error.response.js';
import { PaymentMethod } from '@prisma/client';
import { calculateProductPriceAndWeight } from './calculateWeight.js';

export const getUserAndAddress = async (userId: any, addressId: any) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, addresses: true },
  });
  if (!user) throw new ResponseError(401, 'Unauthorized');
  const userAddress = user.addresses.find(
    (address: any) => address.id === addressId,
  );
  if (!userAddress) throw new ResponseError(401, 'Address not found');
  return userAddress;
};

export const applyVoucherDiscount = async (
  userVoucherId: string,
  totalPrice: number,
  cartItemsLength: number,
) => {
  const userVoucher = await prisma.userVoucher.findUnique({
    where: { id: userVoucherId },
    include: { voucher: true },
  });

  if (!userVoucher) throw new ResponseError(400, 'Invalid user voucher');
  if (userVoucher.expiresAt < new Date())
    throw new ResponseError(400, 'Voucher has expired');
  if (userVoucher.isUsed)
    throw new ResponseError(400, 'Voucher has already been used');

  const voucher = userVoucher.voucher;
  if (voucher.minOrderPrice && totalPrice < voucher.minOrderPrice) {
    throw new ResponseError(
      400,
      `Minimum order price for this voucher is ${voucher.minOrderPrice}`,
    );
  }

  if (voucher.minOrderItem && cartItemsLength < voucher.minOrderItem) {
    throw new ResponseError(
      400,
      `Minimum order items for this voucher is ${voucher.minOrderItem}`,
    );
  }

  if (voucher.discountType === 'FIXED_DISCOUnt') {
    totalPrice -= voucher.fixedDiscount || 0;
  } else if (voucher.discountType === 'DISCOUNT') {
    totalPrice -= (totalPrice * (voucher.discount || 0)) / 100;
  }

  await prisma.userVoucher.update({
    where: { id: userVoucher.id },
    data: { isUsed: true },
  });

  return totalPrice;
};

export const calculateShipping = async (
  nearestStore: any,
  userAddress: any,
  weight: number,
  courier: any,
) => {
  return await calculateShippingCost(
    +nearestStore?.cityId!,
    +userAddress.cityId,
    weight,
    mapCourierTypeToRajaOngkir(courier),
  );
};

export const calculateTotalPriceAndWeight = (updatedCartItem: any[]) => {
  let totalPrice = 0,
    weight = 0;
  updatedCartItem.forEach((item: any) => {
    const { productPrice, productWeight } =
      calculateProductPriceAndWeight(item);
    totalPrice += item.quantity * productPrice;
    weight += item.quantity * productWeight;
  });
  return { totalPrice, weight };
};

export const createOrder = async (
  orderRequest: OrderRequest,
  userId: any,
  nearestStore: any,
  updatedCartItem: any[],
  totalPrice: number,
  shippingCost: any,
  cost: number,
  estimation: string,
) => {
  let finalTotalPrice = totalPrice;

  // Check if a voucherId is provided and apply the discount
  if (orderRequest.userVoucherId) {
    try {
      finalTotalPrice = await applyVoucherDiscount(
        orderRequest.userVoucherId,
        totalPrice,
        updatedCartItem.length,
      );
      console.log(`Discount applied. Final total price: ${finalTotalPrice}`);
    } catch (error) {
      throw new Error(`Failed to apply voucher: ${error}`);
    }
  }
  return await prisma.order.create({
    data: {
      userId,
      paymentMethod: orderRequest.paymentMethod as PaymentMethod,
      courier: getCourierType(orderRequest.courier),
      service: orderRequest.service,
      serviceDescription: 'Layanan Reguler',
      estimation: `${estimation} days`,
      storeId: nearestStore?.id,
      note: orderRequest.note,
      totalPrice: finalTotalPrice,
      shippingCost: cost,
      totalPayment: finalTotalPrice + cost,
      orderItems: { connect: updatedCartItem.map((item) => ({ id: item.id })) },
    } as any,
  });
};

export const updateOrderItemsAndStock = async (
  updatedCartItem: any[],
  orderId: any,
) => {
  await prisma.$transaction([
    prisma.orderItem.updateMany({
      where: { id: { in: updatedCartItem.map((item: any) => item.id) } },
      data: { orderId, orderItemType: 'ORDER_ITEM' },
    }),
    ...updatedCartItem.map((item: any) =>
      prisma.stock.update({
        where: { id: item.stockId },
        data: { amount: { decrement: item.quantity } },
      }),
    ),
    ...updatedCartItem.map((item: any) =>
      prisma.stockMutation.create({
        data: {
          stockId: item.stockId,
          mutationType: 'ORDER',
          amount: item.quantity,
          orderId: orderId,
        },
      }),
    ),
  ]);
};
