import { ICallback } from '@/types/index.js';
import { OrderStoreService } from './admin-store.service.js';

export class OrderStoreController {
  getOrdersByStoreAdmin: ICallback = async (req, res, next) => {
    try {

      const storeId = res.locals.store?.id;
      const storeAdminId =
        await OrderStoreService.getStoreAdminIdByStoreId(storeId);
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.perPage as string) || 10;
      const { orders, totalCount } =
        await OrderStoreService.getOrdersByStoreAdmin(
          storeAdminId,
          page,
          perPage,
        );
      return res.status(201).json({ status: 'OK', data: orders, totalCount });
    } catch (error) {
      next(error);
    }
  };
  sendUserOrders: ICallback = async (req, res, next) => {
    try {
      const order = await OrderStoreService.sendUserOrders(req.body, res);
      return res.status(200).json({ status: 'OK', data: order });
    } catch (error) {
      next(error);
    }
  };
  cancelOrderByAdmin: ICallback = async (req, res, next) => {
    try {
      const order = await OrderStoreService.cancelOrderByAdmin(req.body, res);
      return res.status(200).json({ status: 'OK', data: order });
    } catch (error) {
      next(error);
    }
  };
}
