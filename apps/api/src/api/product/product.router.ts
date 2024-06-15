import { AuthMiddleware } from '@/middlewares/auth.middleware.js';
import { Router } from 'express';
import { ProductController } from './product.controller.js';

export class ProductRouter {
  private router: Router;
  private ProductController: ProductController;

  constructor() {
    this.ProductController = new ProductController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', AuthMiddleware.superAdmin, this.ProductController.getProducts);
    this.router.get('/:id', AuthMiddleware.authed, this.ProductController.getProductById);
    this.router.post('/', AuthMiddleware.superAdmin, this.ProductController.createProduct); 
    this.router.put('/:id', AuthMiddleware.superAdmin, this.ProductController.updateProduct); 
    this.router.delete('/:id', AuthMiddleware.superAdmin, this.ProductController.deleteProduct); 
  }

  getRouter(): Router {
    return this.router;
  }
}
