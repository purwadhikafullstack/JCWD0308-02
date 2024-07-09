import { prisma } from "@/db.js";
import { CartRequest, UpdateCartRequest } from "@/types/cart.type.js";
import { ResponseError } from "@/utils/error.response.js";
import { Validation } from "@/utils/validation.js";
import { CartValidation, patchCartValidation } from "./cart.validation.js";
import { Response } from "express";
import { findNearestStore, findStoresInRange } from "../distance/distance.service.js";
import { OrderItemType } from "@prisma/client";

export class CartService {
  static addToCart = async (req: CartRequest, res: Response) => {
    const cartRequest: CartRequest = Validation.validate(CartValidation.CART, req);
    console.log("cartRequest:", cartRequest);

    const user = await prisma.user.findUnique({
      where: { id: res.locals.user?.id },
      select: { id: true, status: true, role: true, addresses: true },
    });

    const userAddress = user?.addresses.find((address: any) => address.id === cartRequest.addressId);

    if (!userAddress) throw new ResponseError(401, "Address not found!");

    // Find the nearest store based on the user's address
    const { nearestStore } = await findNearestStore(cartRequest.addressId);
    if (!nearestStore) throw new ResponseError(404, "Nearest store not found!");

    const stock = await prisma.stock.findFirst({
      where: { productId: cartRequest.productId, storeId: nearestStore.id },
    });
    if (!stock) throw new ResponseError(400, "Stock not found!");

    const existingCartItem = await prisma.orderItem.findFirst({
      where: {
        userId: user?.id,
        stockId: stock.id,
        orderItemType: OrderItemType.CART_ITEM,
        isPack: cartRequest.isPack,
        isDeleted: false,
      },
    });

    if (existingCartItem) {
      console.log("Updating existing cart item:", existingCartItem);
      const updatedCartItem = await prisma.orderItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + cartRequest.quantity,
          isChecked: false,
        },
      });
      console.log("Updated cart item:", updatedCartItem);
      return updatedCartItem;
    }

    console.log("No existing cart item, creating a new one.");
    // If the item is not in the cart
    const orderItem = await prisma.orderItem.create({
      data: {
        userId: user?.id,
        stockId: stock.id,
        quantity: cartRequest.quantity,
        isPack: cartRequest.isPack,
        isChecked: false,
        orderItemType: OrderItemType.CART_ITEM,
      },
    } as any);
    console.log("orderItem:", orderItem);
    return orderItem;
  };

  static updateCart = async (req: UpdateCartRequest, res: Response) => {
    const patchCart: UpdateCartRequest = Validation.validate(patchCartValidation.CART, req);

    const userId = res.locals.user?.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { addresses: true },
    });

    const userAddress = user?.addresses.find((address: any) => address.id === patchCart?.addressId);

    if (!userAddress) throw new ResponseError(401, "Address not found!");
    const nearbyStore = await findStoresInRange(userAddress.coordinate, 20);
    let stock;
    for (const store of nearbyStore) {
      stock = await prisma.stock.findFirst({
        where: { productId: patchCart.productId, storeId: store.id },
      });
      if (stock) break;
    }
    if (!stock) {
      const centralStore = await prisma.store.findUnique({
        where: { slug: "grosirun-pusat" },
      });
      if (centralStore) {
        stock = await prisma.stock.findFirst({
          where: {
            productId: patchCart.productId,
            storeId: centralStore.id,
          },
        });
      }
    }
    if (!stock) throw new ResponseError(400, "Stock not found in any nearby or central store!");
    const cartItem = await prisma.orderItem.findFirst({
      where: {
        userId,
        stockId: stock.id,
        orderItemType: "CART_ITEM",
        isDeleted: false,
      },
    });

    if (!cartItem) throw new ResponseError(401, "Item not found in cart!");

    // Adjust the quantity based on the patchCart.quantity
    const newQuantity = patchCart.quantity || 0;

    if (newQuantity <= 0) {
      const existingCart = await prisma.orderItem.update({
        where: { id: cartItem.id },
        data: { isDeleted: true },
      });
      return existingCart;
    }

    const updatedOrderItem = await prisma.orderItem.update({
      where: { id: cartItem.id },
      data: { quantity: newQuantity, isChecked: false },
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

  static deleteCart = async (cartId: string, userId: string) => {
    const cartItem = await prisma.orderItem.findFirst({
      where: {
        id: cartId,
        userId,
        orderItemType: "CART_ITEM",
        isDeleted: false,
      },
    });

    if (!cartItem) {
      throw new ResponseError(404, "Cart item not found");
    }

    const deleteCart = await prisma.orderItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
    return deleteCart;
  };

  static getCart = async (userId: string, res: Response) => {
    const newAddressId = res.locals.address?.id;
    // const userId = res.locals.user?.id;
    if (!newAddressId || !userId) {
      throw new ResponseError(403, "there is no address and user");
    }
    const { nearestStore: newNearestStore } = await findNearestStore(newAddressId);
    const carts = await prisma.orderItem.findMany({
      where: {
        userId,
        orderItemType: OrderItemType.CART_ITEM,
        isDeleted: false,
      },
      include: { stock: { include: { product: { include: { images: true } } } } },
    });

    // Determine which items belong to a different store
    const itemsToDelete = carts.filter((item) => item.stock.storeId !== newNearestStore?.id).map((item) => item.id);

    // Mark items belonging to a different store as deleted
    if (itemsToDelete.length > 0) {
      await prisma.orderItem.updateMany({
        where: { id: { in: itemsToDelete } },
        data: { isDeleted: true, deletedAt: new Date() },
      });
    }

    // Fetch the updated cart items to return to the user
    const updatedCarts = await prisma.orderItem.findMany({
      where: {
        userId,
        orderItemType: OrderItemType.CART_ITEM,
        isDeleted: false,
      },
      include: { stock: { include: { product: { include: { images: true } } } } },
    });

    console.log("Updated Cart Items:", updatedCarts);
    return updatedCarts;
  };

  static getCartItemCount = async (userId: string, res: Response) => {
    const cartItems = await CartService.getCart(userId, res);
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };
}
