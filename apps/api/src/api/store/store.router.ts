import { Router } from 'express';
import { AuthMiddleware } from '@/middlewares/auth.middleware.js';
import { StoreController } from './store.controller.js';

export class StoreRouter {
  private router: Router;
  private storeController: StoreController;

  constructor() {
    this.storeController = new StoreController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.storeController.getAllStores);
    this.router.get('/:storeId', this.storeController.getStore);
  }

  public getRouter(): Router {
    return this.router;
  }
}
