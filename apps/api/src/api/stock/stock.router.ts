import { Router } from 'express';
import { StockController } from './stock.controller.js';

export class StockRouter {
  private router: Router;
  private stockController: StockController;

  constructor() {
    this.stockController = new StockController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/', this.stockController.addStock);
    this.router.post('/post-stock-id', this.stockController.postStockId);
    this.router.get('/:stockId', this.stockController.getStock);
  }

  getRouter(): Router {
    return this.router;
  }
}
