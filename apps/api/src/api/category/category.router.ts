import { Router } from 'express';
import { CategoryController } from './category.controller.js';
import { AuthMiddleware } from '@/middlewares/auth.middleware.js';

export class CategoryRouter {
  private router: Router;
  private categoryController: CategoryController;

  constructor() {
    this.categoryController = new CategoryController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.categoryController.getCategories);
    this.router.get('/:id', this.categoryController.getCategoryById);
    this.router.post('/', AuthMiddleware.superAdmin, this.categoryController.createCategory);
    this.router.put('/:id', AuthMiddleware.superAdmin, this.categoryController.updateCategory);
    this.router.delete('/:id', AuthMiddleware.superAdmin, this.categoryController.deleteCategory);
  }

  getRouter(): Router {
    return this.router;
  }
}
