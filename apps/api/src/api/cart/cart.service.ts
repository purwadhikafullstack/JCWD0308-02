import { prisma } from '@/db.js';
import { CartRequest, UpdateCartRequest } from '@/types/cart.type.js';
import { ResponseError } from '@/utils/error.response.js';
import { Validation } from '@/utils/validation.js';
import { CartValidation, patchCartValidation } from './cart.validation.js';
import { Response } from 'express';
import { findNearestStore } from '../distance/distance.service.js';
import { OrderItemType } from '@prisma/client';

export class CartService {
  static addToCart = async (req: CartRequest, res: Response) => {
    const cartRequest: CartRequest = Validation.validate(CartValidation.CART, req);
    const stock = await prisma.stock.findUnique({
      where: { id: cartRequest?.stockId! },
    });
    if (!stock) throw new ResponseError(400, 'Stock not found!');

    const userId = res.locals?.user?.id!;
    const existingCartItem = await prisma.orderItem.findFirst({
      where: {
        userId,
        stockId: stock.id,
        orderItemType: OrderItemType.CART_ITEM,
        isDeleted: false,
        isPack: cartRequest.isPack,
      },
    });
    if (existingCartItem) {
      const updatedCartItem = await prisma.orderItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + cartRequest.quantity },
      });
      return updatedCartItem;
    }
    const orderItem = await prisma.orderItem.create({
      data: {
        userId,
        stockId: stock.id,
        quantity: cartRequest.quantity,
        orderItemType: OrderItemType.CART_ITEM,
        isPack: cartRequest.isPack,
      },
    });
    return orderItem;
  };

  static updateCart = async (req: UpdateCartRequest, res: Response) => {
    const patchCart: UpdateCartRequest = Validation.validate(patchCartValidation.CART, req);
    const stock = await prisma.stock.findUnique({
      where: { id: patchCart.stockId! },
    });
    if (!stock) throw new ResponseError(400, 'Stock not found!');

    const cartItem = await prisma.orderItem.findUnique({
      where: { id: patchCart.cartItemId! },
      select: { id: true },
    });
    if (!cartItem) throw new ResponseError(401, 'Item not found in cart!');

    const newQuantity = patchCart.quantity || 0;
    if (newQuantity <= 0) {
      const existingCart = await prisma.orderItem.update({
        where: { id: cartItem.id },
        data: { isDeleted: true },
      });
      return existingCart;
    }
    if (newQuantity > stock.amount) {
      throw new ResponseError(400, 'quantity exceed the stocks');
    }

    const updatedOrderItem = await prisma.orderItem.update({
      where: { id: cartItem.id },
      data: { quantity: newQuantity },
    });
    return updatedOrderItem;
  };

  static async updateCartItemCheckedStatus(cartId: string, isChecked: boolean) {
    const updatedCartItem = await prisma.orderItem.update({
      where: { id: cartId },
      data: { isChecked },
    });
    return updatedCartItem;
  }

  static async updateCheckedAll(userId: string, isChecked: boolean) {
    await prisma.orderItem.updateMany({
      where: { userId, orderItemType: 'CART_ITEM' },
      data: { isChecked },
    });
  }

  static deleteCart = async (cartId: string, userId: string) => {
    const cartItem = await prisma.orderItem.findFirst({
      where: {
        id: cartId,
        userId,
        orderItemType: 'CART_ITEM',
        isDeleted: false,
      },
    });
    if (!cartItem) throw new ResponseError(404, 'Cart item not found');
    const deleteCart = await prisma.orderItem.update({
      where: { id: cartItem.id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
    return deleteCart;
  };

  static getCart = async (userId: string, res: Response) => {
    const newAddressId = res.locals.address?.id;
    if (!newAddressId || !userId) throw new ResponseError(403, 'there is no address and user');
    const { nearestStore: newNearestStore } = await findNearestStore(newAddressId);
    const carts = await prisma.orderItem.findMany({
      where: {
        userId,
        orderItemType: OrderItemType.CART_ITEM,
        isDeleted: false,
      },
      include: {
        stock: { include: { product: { include: { images: true } } } },
      },
    });
    const itemsToDelete = carts.filter((item) => item.stock.storeId !== newNearestStore?.id).map((item) => item.id);
    if (itemsToDelete.length > 0) {
      await prisma.orderItem.updateMany({
        where: { id: { in: itemsToDelete } },
        data: { isDeleted: true, deletedAt: new Date() },
      });
    }
    const updatedCarts = await prisma.orderItem.findMany({
      where: {
        userId,
        orderItemType: OrderItemType.CART_ITEM,
        isDeleted: false,
      },
      include: {
        stock: { include: { product: { include: { images: true } } } },
      },
    });
    return updatedCarts;
  };

  static getCartItemCount = async (userId: string, res: Response) => {
    const cartItems = await CartService.getCart(userId, res);
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };
}
