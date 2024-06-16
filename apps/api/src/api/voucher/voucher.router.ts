import { Router } from 'express';
import { VoucherController } from './voucher.controller.js';

export class VoucherRouter {
  private router: Router;
  private voucherController: VoucherController;

  constructor() {
    this.voucherController = new VoucherController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/', this.voucherController.createVoucher);
    this.router.post('/assign', this.voucherController.assignVoucherToUser);
    this.router.get('/', this.voucherController.getVoucher);
    this.router.get('/:userId', this.voucherController.getUserVouchers);
  }

  getRouter(): Router {
    return this.router;
  }
}
