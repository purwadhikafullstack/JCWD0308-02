import { calculateShippingCost } from "@/api/shipping/shipping.service.js";
import { prisma } from "@/db.js";
import { OrderRequest, getCourierType, mapCourierTypeToRajaOngkir } from "@/types/order.type.js";
import { ResponseError } from "@/utils/error.response.js";
import { PaymentMethod } from "@prisma/client";
import { calculateProductPriceAndWeight } from "./calculateWeight.js";
import { Response } from "express";
import { calculateFinalPrices } from "./addOrderToPayment.js";

export const getAddress = async (res: Response) => {
  const addressId = res.locals.address?.id;
  if (!addressId) throw new ResponseError(404, "Address not found!");
  const address = await prisma.userAddress.findUnique({
    where: { id: addressId },
  });
  if (!address) throw new ResponseError(404, "Address not found!");

  return address;
};

const validateUserVoucher = async (userVoucherId: string) => {
  const userVoucher = await prisma.userVoucher.findUnique({
    where: { id: userVoucherId },
    include: { voucher: true },
  });
  if (!userVoucher) throw new ResponseError(400, "Invalid user voucher");
  if (userVoucher.expiresAt < new Date()) throw new ResponseError(400, "Voucher has expired");
  if (userVoucher.isUsed) throw new ResponseError(400, "Voucher has already been used");
  return userVoucher;
};

const validateVoucherUsage = (voucher: any, totalPrice: number, cartItemsLength: number) => {
  if ((voucher.minOrderPrice && totalPrice < voucher.minOrderPrice) || (voucher.minOrderItem && cartItemsLength < voucher.minOrderItem)) {
    throw new ResponseError(400, `Voucher cannot be used`);
  }
};

const getDiscountAmount = (voucher: any, amount: number) => {
  return voucher.discountType === "FIXED_DISCOUNT" ? voucher.fixedDiscount || 0 : (amount * (voucher.discount || 0)) / 100;
};

const calculateDiscount = (voucher: any, totalPrice: number, shippingCost: number, cartItemsLength: number) => {
  validateVoucherUsage(voucher, totalPrice, cartItemsLength);

  let discountProducts = 0;
  let discountShippingCost = 0;

  if (voucher.voucherType === "PRODUCT") {
    discountProducts = getDiscountAmount(voucher, totalPrice);
  } else if (voucher.voucherType === "SHIPPING_COST") {
    discountShippingCost = getDiscountAmount(voucher, shippingCost);
  }

  return { discountProducts, discountShippingCost };
};

export const applyVoucherDiscount = async (userVoucherId: string, totalPrice: number, shippingCost: number, cartItemsLength: number) => {
  const userVoucher = await validateUserVoucher(userVoucherId);
  const { voucher } = userVoucher;
  const { discountProducts, discountShippingCost } = calculateDiscount(voucher, totalPrice, shippingCost, cartItemsLength);
  await prisma.userVoucher.update({
    where: { id: userVoucher.id },
    data: { isUsed: true },
  });
  return { discountProducts, discountShippingCost };
};

export const applyDiscounts = async (orderRequest: any, totalPrice: number, cost: number, cartItemsLength: number) => {
  if (!orderRequest.userVoucherId) return { discountProducts: 0, discountShippingCost: 0 };
  return await applyVoucherDiscount(orderRequest.userVoucherId, totalPrice, cost, cartItemsLength);
};

export const calculateShipping = async (nearestStore: any, cityId: any, weight: number, courier: any) => {
  return await calculateShippingCost(+nearestStore?.cityId!, +cityId, weight, mapCourierTypeToRajaOngkir(courier));
};

export const calculateTotalPriceAndWeight = (updatedCartItem: any[]) => {
  let totalPrice = 0,
    weight = 0;
  updatedCartItem.forEach((item: any) => {
    const { productPrice, productWeight } = calculateProductPriceAndWeight(item);
    totalPrice += item.quantity * productPrice;
    weight += item.quantity * productWeight;
  });
  return { totalPrice, weight };
};

export const getEstimatedDeliveryDate = (estimation: number) => {
  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + estimation);
  return estimatedDeliveryDate.toISOString().split("T")[0];
};

export const updateOrderItemsAndStock = async (updatedCartItem: any[], orderId: any) => {
  await prisma.$transaction([
    prisma.orderItem.updateMany({
      where: { id: { in: updatedCartItem.map((item: any) => item.id) } },
      data: { orderId, orderItemType: "ORDER_ITEM", isChecked: true },
    }),
    ...updatedCartItem.map((item: any) =>
      prisma.stock.update({
        where: { id: item.stockId },
        data: {
          amount: {
            decrement: item.isPack ? item.packQuantity * item.quantity : item.quantity,
          },
        },
      }),
    ),
    ...updatedCartItem.map((item: any) =>
      prisma.stockMutation.create({
        data: {
          stockId: item.stockId,
          mutationType: "ORDER",
          amount: item.isPack ? item.packQuantity * item.quantity : item.quantity,
          orderId: orderId,
        },
      }),
    ),
  ]);
};

