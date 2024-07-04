import { ICallback } from '@/types/index.js';
import { ReportService } from './report.service.js';
import { ResponseError } from '@/utils/error.response.js';

export class ReportController {
  getStockMutation: ICallback = async (req, res, next) => {
    try {
      const storeId = res.locals.store?.id;
      if (!storeId)
        throw new ResponseError(404, 'Store ID not fount in request');
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.perPage as string) || 10;
      const { mutations, totalCount } = await ReportService.getStockMutation(
        storeId,
        page,
        perPage,
      );
      return res
        .status(201)
        .json({ status: 'OK', data: mutations, totalCount });
    } catch (error) {
      next(error);
    }
  };

  getStockMutationById: ICallback = async (req, res, next) => {
    try {
      console.log('pingpongpong');
      const storeId = res.locals.store?.id;
      console.log('Store ID from res.locals:', storeId);
      const storeAdminId =
        await ReportService.getStoreAdminIdByStoreId(storeId);
      console.log('Store Admin ID:', storeAdminId);
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.perPage as string) || 10;
      const { mutations, totalCount } =
        await ReportService.getStockMutationById(storeAdminId, page, perPage);
      return res
        .status(201)
        .json({ status: 'OK', data: mutations, totalCount });
    } catch (error) {
      next(error);
    }
  };
}
