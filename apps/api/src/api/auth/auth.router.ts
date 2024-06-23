
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
    this.router.post('/register', AuthMiddleware.noAuthOnly, this.authController.createUserByEmail);
    this.router.post('/signin', AuthMiddleware.noAuthOnly, this.authController.signin);
    this.router.post('/signout', AuthMiddleware.authed, this.authController.signout);
    this.router.get('/github', AuthMiddleware.noAuthOnly, this.authController.github);
    this.router.get('/github/callback', AuthMiddleware.noAuthOnly, this.authController.githubCallback);
    this.router.get('/google', AuthMiddleware.noAuthOnly, this.authController.google);
    this.router.get('/google/callback', AuthMiddleware.noAuthOnly, this.authController.googleCallback);
    this.router.get('/session', AuthMiddleware.noAuthOnly, this.authController.getSession);
  }

  getRouter(): Router {
    return this.router;
  }
}