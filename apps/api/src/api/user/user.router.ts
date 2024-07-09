
import { UserController } from '@/api/user/user.controller.js';
import { uploader } from '@/helpers/uploader.js';
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
    this.router.patch('/profile', AuthMiddleware.authed, uploader('IMG').single('file'), this.userController.updateUser);
    this.router.post('/profile/email', AuthMiddleware.authed, this.userController.changeEmailRequest);
    this.router.patch('/profile/password', AuthMiddleware.authed, this.userController.changePassword);
    this.router.get('/profile/email/:token', this.userController.checkToken);
    this.router.patch('/profile/email/:token', AuthMiddleware.authed, this.userController.changeEmail);
    this.router.get('/:id', AuthMiddleware.authed, this.userController.getUserById);
    this.router.post('/', AuthMiddleware.superAdmin, this.userController.createUserByAdmin);
    this.router.put('/:id', AuthMiddleware.superAdmin, this.userController.updateUserByAdmin);
    this.router.delete('/:id', AuthMiddleware.superAdmin, this.userController.deleteUserByAdmin);
  }

  getRouter(): Router {
    return this.router;
  }
}