import { Router } from 'express';
import { AuthMiddleware } from '@/middlewares/auth.middleware.js';
import { OrderStoreController } from './stores.controller.js';

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
    this.router.post(
      '/:orderId/send',
      storeAdmin,
      this.orderStoreController.sendUserOrders,
    );
    // Endpoint for canceling an order by an admin
    this.router.post(
      '/:orderId/cancel-by-admin',
      storeAdmin,
      this.orderStoreController.cancelOrderByAdmin,
    );
    // Endpoint for fetching orders by store admin
    this.router.get(
      '/store/:storeAdminId',
      storeAdmin,
      this.orderStoreController.getOrdersByStoreAdmin,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
