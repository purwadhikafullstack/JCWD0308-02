import { Router } from "express";
import { StockController } from "./stock.controller.js";
import { AuthMiddleware } from "@/middlewares/auth.middleware.js";

export class StockRouter {
  private router: Router;
  private stockController: StockController;

  constructor() {
    this.stockController = new StockController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/", AuthMiddleware.authed, this.stockController.getStocks);
    this.router.get("/nearest", this.stockController.getNearestStocks);
    this.router.get("/:id", AuthMiddleware.authed, this.stockController.getStockById);
    this.router.post("/", AuthMiddleware.storeAdmin, this.stockController.createStock);
    this.router.put("/:id", AuthMiddleware.storeAdmin, this.stockController.updateStockAmount);
    this.router.delete("/:id", AuthMiddleware.storeAdmin, this.stockController.deleteStock);
  }

  public getRouter(): Router {
    return this.router;
  }
}
