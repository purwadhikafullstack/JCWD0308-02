import { Router } from "express";
import { AuthMiddleware } from "@/middlewares/auth.middleware.js";
import { OrderSuperController } from "./admin-super.controller.js";

export class OrderSuperRouter {
  private router: Router;
  private orderSuperController: OrderSuperController;

  constructor() {
    this.orderSuperController = new OrderSuperController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    const superAdmin = AuthMiddleware.superAdmin;
    this.router.get("/all-orders", this.orderSuperController.getAllOrders);
    this.router.post("/:orderId/confirm-payment", superAdmin, this.orderSuperController.confirmPayment);
  }

  getRouter(): Router {
    return this.router;
  }
}
