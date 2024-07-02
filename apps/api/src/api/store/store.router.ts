import { Router } from 'express';
import { AuthMiddleware } from '@/middlewares/auth.middleware.js';
import { StoreController } from './store.controller.js';
import { uploader } from '@/helpers/uploader.js';

export class StoreRouter {
  private router: Router;
  private storeController: StoreController;

  constructor() {
    this.storeController = new StoreController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.storeController.getStores);
    this.router.get('/with-relations', this.storeController.getAllStores);
    this.router.get('/selected', AuthMiddleware.storeAdmin, this.storeController.getSelectedStore);
    this.router.get('/:storeId', AuthMiddleware.storeAdmin, this.storeController.getStore);
    this.router.get('/:storeId/admin', AuthMiddleware.storeAdmin, this.storeController.getStoreAdmin);
    this.router.patch('/:storeId', AuthMiddleware.superAdmin, uploader('IMG', '/images').single('file'), this.storeController.updateStore);
    this.router.delete('/:storeId', AuthMiddleware.superAdmin, this.storeController.deleteStore);
    this.router.post('/', AuthMiddleware.superAdmin, uploader('IMG', '/images').single('file'), this.storeController.createStore);
  }

  public getRouter(): Router {
    return this.router;
  }
}
