import { Router } from 'express';
import { AuthMiddleware } from '@/middlewares/auth.middleware.js';
import { OrderController } from './order.controller.js';

export class OrderRouter {
  private router: Router;
  private orderController: OrderController;

  constructor() {
    this.orderController = new OrderController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.orderController.getOrder);
    this.router.post('/add-order', this.orderController.addOrder);
    this.router.post('/cancel-order', this.orderController.cancelOrder);
  }

  getRouter(): Router {
    return this.router;
  }
}
