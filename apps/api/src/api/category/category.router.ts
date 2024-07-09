import { Router } from 'express';
import { CategoryController } from './category.controller.js';
import { AuthMiddleware } from '@/middlewares/auth.middleware.js';
import { uploader } from '@/helpers/uploader.js';

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
    this.router.post('/', AuthMiddleware.superAdmin, uploader('CATEGORY').fields([{ name: 'iconUrl', maxCount: 1 }, { name: 'imageUrl', maxCount: 1 }]), this.categoryController.createCategory);
    this.router.put('/:id', AuthMiddleware.superAdmin, uploader('CATEGORY').fields([{ name: 'iconUrl', maxCount: 1 }, { name: 'imageUrl', maxCount: 1 }]), this.categoryController.updateCategory);
    this.router.delete('/:id', AuthMiddleware.superAdmin, this.categoryController.deleteCategory);
  }

  getRouter(): Router {
    return this.router;
  }
}
