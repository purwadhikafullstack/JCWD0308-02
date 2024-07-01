import { Router } from 'express';
import { ProvinceController } from './province.controller.js';


export class ProvinceRouter {
  private router: Router;
  private provinceController: ProvinceController;

  constructor() {
    this.provinceController = new ProvinceController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.provinceController.getProvinces);
  }

  getRouter(): Router {
    return this.router;
  }
}
