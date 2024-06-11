import { prisma } from '@/db.js';
import { CartRequest, UpdateCartRequest } from '@/types/cart.type.js';
import { ResponseError } from '@/utils/error.response.js';
import { Validation } from '@/utils/validation.js';
import { CartValidation, patchCartValidation } from './cart.validation.js';
import { Response } from 'express';

export class CartService {
  static addToCart = async (req: CartRequest, res: Response) => {
    const cartRequest: CartRequest = Validation.validate(
      CartValidation.CART,
      req,
    );
    //hanya user yang active dan role user
    const user = await prisma.user.findUnique({
      where: { id: res.locals.user?.id },
      select: { id: true, status: true, role: true },
    });

    if (!user) throw new ResponseError(401, 'Unauthorized');

    //validasi adanya stok
    const stock = await prisma.stock.findUnique({
      where: { id: cartRequest.stockId },
    });

    if (!stock) {
      throw new ResponseError(400, 'Stock not found!');
    }

    //validasi ada barangnya di cart/tidak
    const existingCartItem = await prisma.orderItem.findFirst({
      where: {
        userId: user.id,
        stockId: cartRequest.stockId,
        orderItemType: 'CART_ITEM',
        isDeleted: false,
      },
    });

    if (existingCartItem) {
      const updatedCartItem = await prisma.orderItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + cartRequest.quantity,
          isChecked: true,
        },
      });
      return updatedCartItem;
    }

    //kalau gaada di cart
    const orderItem = await prisma.orderItem.create({
      data: {
        userId: user?.id,
        stockId: cartRequest.stockId,
        quantity: cartRequest.quantity,
        isPack: cartRequest.isPack,
      },
    });
    return orderItem;
  };

  static updateCart = async (req: UpdateCartRequest, res: Response) => {
    const patchCart: UpdateCartRequest = Validation.validate(
      patchCartValidation.CART,
      req,
    );

    const userId = res.locals.user?.id;

    if (!userId) {
      throw new ResponseError(401, 'Unauthorized');
    }

    const cartItem = await prisma.orderItem.findFirst({
      where: {
        userId,
        ...(patchCart.stockId ? { stockId: patchCart.stockId } : {}),
        orderItemType: 'CART_ITEM',
        isDeleted: false,
      },
    });

    if (!cartItem) throw new ResponseError(401, 'Item not found in cart!');

    const newQuantity = (cartItem.quantity || 0) + (patchCart.quantity || 0);
    if (newQuantity === 0) {
      const existingCart = await prisma.orderItem.update({
        where: { id: cartItem.id },
        data: { isDeleted: true },
      });
      return existingCart;
    }
    const updatedOrderItem = await prisma.orderItem.update({
      where: { id: cartItem.id },
      data: { quantity: newQuantity, isChecked: true },
    });

    return updatedOrderItem;
  };

  static deleteCart = async (cartId: string, userId: string) => {
    if (!userId) {
      throw new ResponseError(401, 'Unauthorized');
    }

    const cartItem = await prisma.orderItem.findFirst({
      where: {
        id: cartId,
        userId,
        orderItemType: 'CART_ITEM',
        isDeleted: false,
      },
    });

    if (!cartItem) {
      throw new ResponseError(404, 'Cart item not found');
    }

    const deleteCart = await prisma.orderItem.delete({
      where: {
        id: cartItem.id,
      },
    });
    return deleteCart;
  };

  static getCart = async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { status: true },
    });

    if (!user) throw new ResponseError(401, 'Unauthorized');

    const cartItems = await prisma.orderItem.findMany({
      where: {
        userId: userId,
        orderItemType: 'CART_ITEM',
        isDeleted: false,
      },
      include: {
        stock: true,
        user: true,
      },
    });

    return cartItems;
  };
}
