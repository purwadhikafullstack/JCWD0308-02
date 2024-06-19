import { Router } from 'express';
import { AuthMiddleware } from '@/middlewares/auth.middleware.js';
import { OrderController } from './order.controller.js';
import { uploader } from '@/helpers/uploader.js';

export class OrderRouter {
  private router: Router;
  private orderController: OrderController;

  constructor() {
    this.orderController = new OrderController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', AuthMiddleware.authed, this.orderController.getOrder);
    this.router.get(
      '/store-admin/order/:storeAdminId',
      AuthMiddleware.storeAdmin,
      this.orderController.getOrdersByStoreAdmin,
    );
    this.router.get(
      '/super-admin/orders',
      AuthMiddleware.superAdmin,
      this.orderController.getAllOrders,
    );
    this.router.post(
      '/add-order',
      AuthMiddleware.authed,
      this.orderController.addOrder,
    );
    this.router.post(
      '/cancel-order',
      AuthMiddleware.authed,
      this.orderController.cancelOrder,
    );
    this.router.post(
      '/send-order',
      AuthMiddleware.storeAdmin,
      this.orderController.sendUserOrders,
    );
    this.router.post(
      '/confirm-order',
      AuthMiddleware.authed,
      this.orderController.confirmOrder,
    );
    this.router.post(
      '/cancel-by-admin',
      AuthMiddleware.storeAdmin,
      this.orderController.cancelOrderByAdmin,
    );
    this.router.patch(
      '/:orderId/payment-proof',
      AuthMiddleware.authed,
      uploader('payment-proof', '').single('proof'),
      this.orderController.uploadProof,
    );
    this.router.post(
      '/:orderId/confirm',
      AuthMiddleware.superAdmin,
      this.orderController.confirmPayment,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
