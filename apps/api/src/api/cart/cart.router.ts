import { Router } from 'express';
import { CartController } from './cart.controller.js';
import { AuthMiddleware } from '@/middlewares/auth.middleware.js';

export class CartRouter {
  private router: Router;
  private cartController: CartController;

  constructor() {
    this.cartController = new CartController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.cartController.getCart);
    this.router.post(
      '/add-to-cart',
      AuthMiddleware.authed,
      this.cartController.addToCart,
    );
    this.router.patch('/update-cart', this.cartController.updateCart);
    this.router.delete('/:cartId', this.cartController.deleteCart);
  }

  getRouter(): Router {
    return this.router;
  }
}
