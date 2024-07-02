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
    this.router.post('/', AuthMiddleware.authed, this.addressController.createAddress);
    this.router.get('/', AuthMiddleware.authed, this.addressController.getAllAddress);
    this.router.get('/selected', AuthMiddleware.authed, this.addressController.getSelectedAddress);
    this.router.patch('/:addressId', AuthMiddleware.authed, this.addressController.updateAddress);
    this.router.delete('/:addressId', AuthMiddleware.authed, this.addressController.deleteAddress);
  }

  getRouter(): Router {
    return this.router;
  }
}
