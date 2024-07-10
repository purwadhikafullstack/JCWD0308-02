import { prisma } from "@/db.js";
import { getCourierType, OrderRequest } from "@/types/order.type.js";
import { getPaymentLink } from "./paymentGateway.js";
import { PaymentMethod } from "@prisma/client";
import { Response } from "express";

export const prepareOrderData = async (orderRequest: any, userId: any, nearestStore: any, updatedCartItem: any[], totalPrice: number, cost: number, estimation: number, discounts: any) => {
  const { discountProducts, discountShippingCost } = discounts;
  const { finalTotalPrice, finalShippingCost, totalPayment } = calculateFinalPrices(totalPrice, cost, discountProducts, discountShippingCost);
  const orderStatus = "AWAITING_PAYMENT";
  return {
    orderRequest,
    userId,
    nearestStore,
    updatedCartItem,
    finalTotalPrice,
    finalShippingCost,
    estimation,
    orderStatus,
    discountProducts,
    discountShippingCost,
    totalPayment,
  };
};

export const createOrder = async (
  orderRequest: OrderRequest,
  userId: any,
  nearestStore: any,
  updatedCartItem: any[],
  finalTotalPrice: number,
  finalShippingCost: number,
  estimation: string,
  orderStatus: string,
  discountProducts: number,
  discountShippingCost: number,
  totalPayment: number,
) => {
  return await prisma.order.create({
    data: {
      userId,
      orderStatus,
      paymentMethod: orderRequest.paymentMethod as PaymentMethod,
      courier: getCourierType(orderRequest.courier),
      service: orderRequest.service,
      serviceDescription: orderRequest.serviceDescription,
      estimation,
      storeId: nearestStore?.id,
      note: orderRequest.note,
      totalPrice: finalTotalPrice,
      shippingCost: finalShippingCost,
      discountProducts,
      discountShippingCost,
      totalPayment,
      orderItems: { connect: updatedCartItem.map((item) => ({ id: item.id })) },
    } as any,
  });
};

export const calculateFinalPrices = (totalPrice: number, cost: number, discountProducts: number, discountShippingCost: number) => {
  const finalTotalPrice = totalPrice - discountProducts;
  const finalShippingCost = cost - discountShippingCost;
  const totalPayment = finalTotalPrice + finalShippingCost;
  return { finalTotalPrice, finalShippingCost, totalPayment };
};

export const getPaymentLinkData = (orderId: string, totalPayment: number) => {
  return {
    transaction_details: { order_id: orderId, gross_amount: totalPayment },
    expiry: { unit: "minutes", duration: 10 },
  };
};

export const updateOrderPaymentLink = async (orderId: string, paymentLink: string) => {
  return await prisma.order.update({
    where: { id: orderId },
    data: { paymentLink },
  });
};

export const handlePaymentLinkCreation = async (orderRequest: OrderRequest, newOrder: any, totalPayment: number) => {
  let paymentLink = null;
  if (orderRequest.paymentMethod === "GATEWAY") {
    const data = getPaymentLinkData(newOrder.id, totalPayment);
    const paymentResponse = await getPaymentLink(data);
    paymentLink = paymentResponse.redirect_url;
    await updateOrderPaymentLink(newOrder.id, paymentLink);
  }
  return paymentLink;
};
