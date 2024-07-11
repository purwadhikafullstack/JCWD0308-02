import { Router } from "express";
import { AuthMiddleware } from "@/middlewares/auth.middleware.js";
import { OrderController } from "./order.controller.js";
import { uploader } from "@/helpers/uploader.js";

export class OrderRouter {
  private router: Router;
  private orderController: OrderController;

  constructor() {
    this.orderController = new OrderController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    const authed = AuthMiddleware.authed;
    const upload = uploader("payment-proof", "/").single("proof");

    this.router.post("/", authed, this.orderController.addOrder);
    this.router.get("/:orderId", authed, this.orderController.getOrder);
    this.router.patch("/:orderId/payment-proof", authed, upload, this.orderController.uploadProof);
    this.router.post("/:orderId/cancel", authed, this.orderController.cancelOrder);
    this.router.post("/:orderId/confirm", authed, this.orderController.confirmOrder);
    this.router.get("/status/:status", authed, this.orderController.getOrderByStatus);
  }

  getRouter(): Router {
    return this.router;
  }
}
