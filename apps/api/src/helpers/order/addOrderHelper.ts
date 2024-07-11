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

export const updateOrderItemsAndStock = async (updatedCartItem: any[], orderId: string) => {
  const updates = updatedCartItem.map(async (item) => {
    const stock = await prisma.stock.findUnique({
      where: { id: item.stockId },
      include: { product: true },
    });
    if (!stock) {
      throw new Error(`Stock with id ${item.stockId} not found`);
    }
    const decrementValue = item.isPack ? item.quantity * stock.product.packQuantity : item.quantity;
    const amountValue = item.isPack ? item.quantity * stock.product.packQuantity : item.quantity;

    console.log(`Updating Order Item ${item.id}: orderId=${orderId}, decrement=${decrementValue}, amount=${amountValue}`);

    try {
      await prisma.$transaction([
        prisma.orderItem.update({
          where: { id: item.id },
          data: { orderId, orderItemType: "ORDER_ITEM", isChecked: true },
        }),
        prisma.stock.update({
          where: { id: item.stockId },
          data: {
            amount: {
              decrement: decrementValue,
            },
          },
        }),
        prisma.stockMutation.create({
          data: {
            stockId: item.stockId,
            mutationType: "ORDER",
            amount: amountValue,
            orderId,
          },
        }),
      ]);

      console.log("Updates successfully applied.");
    } catch (error) {
      console.error("Error applying updates:", error);
    }
  });

  await Promise.all(updates);
};
