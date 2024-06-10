
import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { AuthMiddleware } from '@/middlewares/auth.middleware.js';

export class AuthRouter {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/register', this.authController.createUserByEmail);
    this.router.post('/signin', this.authController.signin);
    this.router.post('/signout', AuthMiddleware.authed, this.authController.signout);
  }

  getRouter(): Router {
    return this.router;
  }
}