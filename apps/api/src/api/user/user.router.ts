
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
    this.router.get('/', AuthMiddleware.superAdmin, this.userController.getUsers);
    this.router.get('/profile', AuthMiddleware.authed, this.userController.getUserProfile);
    this.router.get('/:id', AuthMiddleware.authed, this.userController.getUserById);
    this.router.post('/', AuthMiddleware.superAdmin, this.userController.createUserByAdmin);
    this.router.put('/:id', AuthMiddleware.superAdmin, this.userController.updateUserByAdmin);
    this.router.delete('/:id', AuthMiddleware.superAdmin, this.userController.deleteUserByAdmin);
  }

  getRouter(): Router {
    return this.router;
  }
}