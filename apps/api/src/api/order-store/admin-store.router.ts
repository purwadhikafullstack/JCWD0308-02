import { Router } from 'express';
import { AuthMiddleware } from '@/middlewares/auth.middleware.js';
import { OrderStoreController } from './admin-store.controller.js';

export class OrderStoreRouter {
  private router: Router;
  private orderStoreController: OrderStoreController;

  constructor() {
    this.orderStoreController = new OrderStoreController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    const storeAdmin = AuthMiddleware.storeAdmin;

    this.router.get(
      '/',
      storeAdmin,
      this.orderStoreController.getOrdersByStoreAdmin,
    );

    this.router.post(
      '/:orderId/send',
      storeAdmin,
      this.orderStoreController.sendUserOrders,
    );

    this.router.post(
      '/:orderId/cancel-by-admin',
      storeAdmin,
      this.orderStoreController.cancelOrderByAdmin,
    );


  getRouter(): Router {
    return this.router;
  }
}
