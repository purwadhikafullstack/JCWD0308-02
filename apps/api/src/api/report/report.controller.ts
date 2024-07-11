import { ICallback } from '@/types/index.js';
import { ReportService } from './report.service.js';
import { ResponseError } from '@/utils/error.response.js';
import { ParsedQs } from 'qs';

export class ReportController {
  getStockMutation: ICallback = async (req, res, next) => {
    try {
      const userRole = res.locals.user?.role;
      let storeId: string | undefined = userRole === 'SUPER_ADMIN' ? req.query.storeId as string : res.locals.store?.id;

      if (Array.isArray(storeId)) {
        storeId = storeId[0];
      }

      if (userRole !== 'SUPER_ADMIN' && !storeId) {
        throw new ResponseError(404, 'Store ID not found in request');
      }

      const { page, perPage, yearMonth } = this.getPaginationAndYearMonth(req.query);
      const { mutations, totalCount } = await ReportService.getStockMutation(storeId || '', page, perPage, yearMonth || '');

      return res.status(200).json({ status: 'OK', data: mutations, totalCount });
    } catch (error) {
      next(error);
    }
  };

  getStockMutationById: ICallback = async (req, res, next) => {
    try {
      const userRole = res.locals.user?.role;
      let storeId: string | undefined = userRole === 'SUPER_ADMIN' ? req.query.storeId as string : res.locals.store?.id;

      if (Array.isArray(storeId)) {
        storeId = storeId[0];
      }

      if (userRole !== 'SUPER_ADMIN' && !storeId) {
        throw new ResponseError(404, 'Store ID not found in request');
      }

      const storeAdminId = userRole === 'SUPER_ADMIN' ? undefined : await ReportService.getStoreAdminIdByStoreId(storeId!);

      const { page, perPage, yearMonth } = this.getPaginationAndYearMonth(req.query);
      const { mutations, totalCount } = await ReportService.getStockMutationById(storeAdminId || '', page, perPage, yearMonth || '');

      return res.status(200).json({ status: 'OK', data: mutations, totalCount });
    } catch (error) {
      next(error);
    }
  };

  private getPaginationAndYearMonth(query: ParsedQs) {
    const page = parseInt(query.page as string) || 1;
    const perPage = parseInt(query.perPage as string) || 10;
    let yearMonth: string | undefined = query.yearMonth as string;

    if (Array.isArray(yearMonth)) {
      yearMonth = yearMonth[0];
    }

    return { page, perPage, yearMonth };
  }
}
