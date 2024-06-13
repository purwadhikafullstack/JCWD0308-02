import { Router } from 'express';
import { AddressController } from './address.controller.js';
import { AuthMiddleware } from '@/middlewares/auth.middleware.js';

export class AddressRouter {
  private router: Router;
  private addressController: AddressController;

  constructor() {
    this.addressController = new AddressController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/', this.addressController.addAddress);
  }

  getRouter(): Router {
    return this.router;
  }
}
