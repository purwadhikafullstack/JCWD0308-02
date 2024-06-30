import { Router } from 'express';
import { CityController } from './city.controller.js';


export class CityRouter {
  private router: Router;
  private cityController: CityController;

  constructor() {
    this.cityController = new CityController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.cityController.getCities);
  }

  getRouter(): Router {
    return this.router;
  }
}
