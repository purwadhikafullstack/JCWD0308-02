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
    const authed = AuthMiddleware.authed;
    const storeAdmin = AuthMiddleware.storeAdmin;
    const superAdmin = AuthMiddleware.superAdmin;
    const upload = uploader('payment-proof', 'orders').single('proof');
    this.router
      .route('/')
      .get(authed, this.orderController.getOrder)
      .post(authed, this.orderController.addOrder);

    this.router
      .route('/:orderId/payment-proof')
      .post(authed, upload, this.orderController.uploadProof);

    this.router
      .route('/:orderId/cancel')
      .post(authed, this.orderController.cancelOrder);

    this.router
      .route('/:orderId/send')
      .post(storeAdmin, this.orderController.sendUserOrders);

    this.router
      .route('/:orderId/confirm')
      .post(authed, this.orderController.confirmOrder);

    this.router
      .route('/admin/cancel')
      .post(storeAdmin, this.orderController.cancelOrderByAdmin);

    this.router
      .route('/admin/orders')
      .get(superAdmin, this.orderController.getAllOrders);
  }

  getRouter(): Router {
    return this.router;
  }
}
