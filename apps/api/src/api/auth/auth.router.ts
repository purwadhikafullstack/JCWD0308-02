
import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { AuthMiddleware } from '@/middlewares/auth.middleware.js';
import { OAuthController } from './oauth.controller.js';

export class AuthRouter {
  private router: Router;
  private authController: AuthController;
  private OAuthController: OAuthController;

  constructor() {
    this.authController = new AuthController();
    this.OAuthController = new OAuthController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/signup', AuthMiddleware.noAuthOnly, this.authController.createUserByEmail);
    this.router.post('/signin', AuthMiddleware.noAuthOnly, this.authController.signin);
    this.router.post('/signout', AuthMiddleware.authed, this.authController.signout);
    this.router.get('/github', AuthMiddleware.noAuthOnly, this.OAuthController.github);
    this.router.get('/github/callback', AuthMiddleware.noAuthOnly, this.OAuthController.githubCallback);
    this.router.get('/google', AuthMiddleware.noAuthOnly, this.OAuthController.google);
    this.router.get('/google/callback', AuthMiddleware.noAuthOnly, this.OAuthController.googleCallback);
    this.router.get('/session', this.authController.getSession);
    this.router.post('/verify/resend/:token', AuthMiddleware.noAuthOnly, this.authController.resendVerify);
    this.router.get('/verify/:token', AuthMiddleware.noAuthOnly, this.authController.checkToken);
    this.router.patch('/verify/:token', AuthMiddleware.noAuthOnly, this.authController.verifyAccount);
    this.router.post('/reset', AuthMiddleware.noAuthOnly, this.authController.resetRequest);
    this.router.get('/reset/:token', AuthMiddleware.noAuthOnly, this.authController.checkToken);
    this.router.patch('/reset/:token', AuthMiddleware.noAuthOnly, this.authController.resetPassword);
  }

  getRouter(): Router {
    return this.router;
  }
}