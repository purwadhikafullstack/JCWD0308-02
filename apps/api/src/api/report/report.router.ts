import { Router } from 'express';
import { AuthMiddleware } from '@/middlewares/auth.middleware.js';
import { ReportController } from './report.controller.js';

export class ReportRouter {
  private router: Router;
  private reportController: ReportController;

  constructor() {
    this.reportController = new ReportController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    const storeAdmin = AuthMiddleware.storeAdmin;
    const superAdmin = AuthMiddleware.superAdmin;

    this.router.get('/', superAdmin, this.reportController.getStockMutation);
    this.router.get('/store-admin', this.reportController.getStockMutationById);
  }

  getRouter(): Router {
    return this.router;
  }
}
