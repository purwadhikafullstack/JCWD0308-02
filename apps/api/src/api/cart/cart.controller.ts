import { ICallback } from "@/types/index.js";
import { CartService } from "./cart.service.js";
import { ResponseError } from "@/utils/error.response.js";

export class CartController {
  addToCart: ICallback = async (req, res, next) => {
    try {
      const cartItem = await CartService.addToCart(req.body, res);
      return res.status(201).json({ status: "OK", data: cartItem });
    } catch (error) {
      next(error);
    }
  };
  updateCart: ICallback = async (req, res, next) => {
    try {
      const cartItem = await CartService.updateCart(req.body, res);
      return res.status(201).json({ status: "OK", data: cartItem });
    } catch (error) {
      next(error);
    }
  };
  updateCartIsCheckedStatus: ICallback = async (req, res, next) => {
    const { cartId, isChecked } = req.body;
    try {
      const updatedCartItem = await CartService.updateCartItemCheckedStatus(cartId, isChecked);
      res.json({ status: "OK", data: updatedCartItem });
    } catch (error) {
      next(error);
    }
  };
  updateCheckedAll: ICallback = async (req, res, next) => {
    const userId = res.locals?.user?.id;
    const { isChecked } = req.body;
    try {
      await CartService.updateCheckedAll(userId!, isChecked);
      res.json({ status: "OK", message: "cart item checked" });
    } catch (error) {
      next(error);
    }
  };
  deleteCart: ICallback = async (req, res, next) => {
    try {
      const cartId = req.params.cartId;
      const userId = res.locals.user?.id;
      if (!userId) throw new ResponseError(401, "Unauthorized");
      await CartService.deleteCart(cartId, userId);
      return res.status(201).json({ status: "OK", message: "Item removed from cart" });
    } catch (error) {
      next(error);
    }
  };
  getCart: ICallback = async (req, res, next) => {
    try {
      const userId = res.locals?.user?.id!;
      const cartItems = await CartService.getCart(userId, res);
      return res.status(200).json({ status: "OK", data: cartItems });
    } catch (error) {
      next(error);
    }
  };
  getCartItemCount: ICallback = async (req, res, next) => {
    try {
      const userId = res.locals?.user?.id!;
      const itemCount = await CartService.getCartItemCount(userId, res);
      return res.status(200).json({ status: "OK", data: itemCount });
    } catch (error) {
      next(error);
    }
  };
}
