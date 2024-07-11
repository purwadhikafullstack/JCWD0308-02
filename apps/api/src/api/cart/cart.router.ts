import { Router } from "express";
import { CartController } from "./cart.controller.js";
import { AuthMiddleware } from "@/middlewares/auth.middleware.js";
import multer from "multer";


export class CartRouter {
  private router: Router;
  private cartController: CartController;

  constructor() {
    this.cartController = new CartController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    const upload = multer();
    this.router.get("/", AuthMiddleware.authed, this.cartController.getCart);
    this.router.post("/add-to-cart", AuthMiddleware.authed, upload.none(), this.cartController.addToCart);
    this.router.patch("/update-cart", AuthMiddleware.authed, this.cartController.updateCart);
    this.router.get("/item-count", AuthMiddleware.authed, this.cartController.getCartItemCount);
    this.router.patch("/checked", AuthMiddleware.authed, this.cartController.updateCartIsCheckedStatus);
    this.router.delete("/:cartId", AuthMiddleware.authed, this.cartController.deleteCart);
  }

  getRouter(): Router {
    return this.router;
  }
}
