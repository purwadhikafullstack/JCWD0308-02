import { Router } from 'express';
import { ReportController } from './report.controller.js';
import { AuthMiddleware } from '@/middlewares/auth.middleware.js';

export class ReportRouter {
  private router: Router;
  private reportController: ReportController;

  constructor() {
    this.reportController = new ReportController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/stock-mutations', AuthMiddleware.authed, this.reportController.getStockMutation);
    this.router.get('/stock-mutations/:id', AuthMiddleware.authed, this.reportController.getStockMutationById);
  }

  public getRouter(): Router {
    return this.router;
  }
}
