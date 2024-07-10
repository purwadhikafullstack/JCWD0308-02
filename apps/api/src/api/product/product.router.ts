import { AuthMiddleware } from "@/middlewares/auth.middleware.js";
import { Router } from "express";
import { ProductController } from "./product.controller.js";
import { uploader } from "@/helpers/uploader.js";
import { convertSpecificFieldsToNumber } from "@/middlewares/number.middleware.js";

const numberFields = ["price", "packPrice", "discountPrice", "discountPackPrice", "packQuantity", "bonus", "minOrderItem", "weight", "weightPack"];

export class ProductRouter {
  private router: Router;
  private productController: ProductController;

  constructor() {
    this.productController = new ProductController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {

    this.router.get('/', this.productController.getProducts);
    this.router.get('/:id', this.productController.getProductById);
    this.router.post('/', AuthMiddleware.superAdmin, uploader('PRODUCT').array('images', 10), convertSpecificFieldsToNumber(numberFields), this.productController.createProduct);
    this.router.put('/:id', AuthMiddleware.superAdmin, uploader('PRODUCT').array('images', 10), convertSpecificFieldsToNumber(numberFields), this.productController.updateProduct);
    this.router.delete('/:id', AuthMiddleware.superAdmin, this.productController.deleteProduct);
    this.router.get('/detail/:slug', AuthMiddleware.authed, this.productController.getProductBySlug);

  }

  public getRouter(): Router {
    return this.router;
  }
}
