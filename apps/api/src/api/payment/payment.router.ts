import { Router } from 'express';
import { PaymentController } from './payment.controller.js';

export class PaymentRouter {
  private router: Router;
  private paymentController: PaymentController;

  constructor() {
    this.paymentController = new PaymentController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/midtrans', this.paymentController.updateOrderStatus);
  }

  getRouter(): Router {
    return this.router;
  }
}
