import { Router } from 'express';
import { ShippingController } from './shipping.controller.js';
import { AuthMiddleware } from '@/middlewares/auth.middleware.js';

export class ShippingRouter {
  private router: Router;
  private shippingController: ShippingController;

  constructor() {
    this.shippingController = new ShippingController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      AuthMiddleware.authed,
      this.shippingController.calculateShippingCost,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
