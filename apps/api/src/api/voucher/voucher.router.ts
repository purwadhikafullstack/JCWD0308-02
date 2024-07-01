import { Router } from 'express';
import { VoucherController } from './voucher.controller.js';
import { uploader } from '@/helpers/uploader.js';
import { AuthMiddleware } from '@/middlewares/auth.middleware.js';




export class VoucherRouter {
  private router: Router;
  private voucherController: VoucherController;

  constructor() {
    this.voucherController = new VoucherController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', AuthMiddleware.authed, this.voucherController.getVouchers);
    this.router.post('/', AuthMiddleware.storeAdmin, uploader('voucher').single('image'), this.voucherController.createVoucher);
    this.router.put('/:id', AuthMiddleware.storeAdmin, uploader('voucher').single('image'), this.voucherController.updateVoucher);
    this.router.delete('/:id', AuthMiddleware.storeAdmin, this.voucherController.deleteVoucher);
    this.router.post('/assign', AuthMiddleware.storeAdmin, this.voucherController.assignVoucherToUser);
    this.router.get('/:userId', AuthMiddleware.authed, this.voucherController.getUserVouchers);
  }

  getRouter(): Router {
    return this.router;
  }
}
