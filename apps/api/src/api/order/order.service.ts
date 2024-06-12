import { prisma } from '@/db.js';
import { OrderRequest } from '@/types/order.type.js';
import { ResponseError } from '@/utils/error.response.js';
import { Validation } from '@/utils/validation.js';

import { Response } from 'express';
import { OrderValidation } from './order.validation.js';
import { findNearestStore } from '../distance/distance.service.js';
import { calculateShippingCost } from '../shipping/shipping.service.js';
import { CourierType, PaymentMethod } from '@prisma/client';

export class OrderService {
  static addOrder = async (req: OrderRequest, res: Response) => {
    const orderRequest: OrderRequest = Validation.validate(
      OrderValidation.ORDER,
      req,
    );

    const userId = res.locals.user?.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, addresses: true },
    });
    if (!user) throw new ResponseError(401, 'Unauthorized');

    const userAddress = user.addresses.find(
      (address) => address.id === orderRequest.addressId,
    );
    if (!userAddress) throw new ResponseError(401, 'Address not found!');

    const cartItems = await prisma.orderItem.findMany({
      where: {
        userId,
        orderItemType: 'CART_ITEM',
        isDeleted: false,
      },
      include: {
        stock: {
          include: {
            product: true,
          },
        },
      },
    });
    if (cartItems.length === 0) {
      throw new ResponseError(400, 'Cart is empty');
    }
    let totalPrice = 0;
    for (const item of cartItems) {
      const stock = await prisma.stock.findUnique({
        where: { id: item.stockId },
      });

      if (!stock || stock.amount < item.quantity) {
        throw new ResponseError(
          400,
          `Stock unavailable for item ${item.stockId}`,
        );
      }
      let productPrice = 0;
      if (item.isPack && item.stock.product.packPrice) {
        productPrice = item.stock.product.packPrice;
      } else if (!item.isPack && item.stock.product.price) {
        productPrice = item.stock.product.price;
      } else {
        throw new ResponseError(
          400,
          `Price not available for item ${item.stockId}`,
        );
      }

      totalPrice += item.quantity * productPrice;
    }
    let weight = 1; //plis ini gimana
    //nearest store
    let nearestStore = await findNearestStore(userAddress.coordinate);
    const shippingCost = await calculateShippingCost(
      nearestStore?.cityId!,
      userAddress.cityId,
      cartItems.reduce((acc, item) => acc + item.quantity * weight, 0),
      orderRequest.courier,
    );

    const addressId = orderRequest.addressId;
    if (!addressId) {
      throw new ResponseError(400, 'Address ID is missing');
    }
    const newOrder = await prisma.order.create({
      data: {
        userId,
        address: { connect: { id: userAddress?.id } },
        paymentMethod: orderRequest.paymentMethod as PaymentMethod,
        courier: orderRequest.courier as CourierType,
        service: orderRequest.service,
        note: orderRequest.note,
        totalPrice,
        shippingCost,
        totalPayment: totalPrice + shippingCost,
        orderItems: {
          connect: cartItems.map((item) => ({ id: item.id })),
        },
      } as any,
    });

    await prisma.orderItem.updateMany({
      where: { id: { in: cartItems.map((item) => item.id) } },
      data: { orderId: newOrder.id, orderItemType: 'ORDER_ITEM' },
    });

    return newOrder;
  };
}
