
import { UserController } from '@/api/user/user.controller.js';
import { AuthMiddleware } from '@/middlewares/auth.middleware.js';
import { Router } from 'express';

export class UserRouter {
  private router: Router;
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', AuthMiddleware.authed, this.userController.getUsers);
    this.router.get('/:id', AuthMiddleware.authed, this.userController.getUserById);
  }

  getRouter(): Router {
    return this.router;
  }
}