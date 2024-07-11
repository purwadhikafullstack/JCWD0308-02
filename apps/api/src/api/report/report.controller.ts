import { ICallback } from '@/types/index.js';
import { ReportService } from './report.service.js';
import { ResponseError } from '@/utils/error.response.js';
import { ParsedQs } from 'qs';

export class ReportController {
  getStockMutation: ICallback = async (req, res, next) => {
    try {
      const userRole = res.locals.user?.role;
      let storeId: string | undefined;

      if (userRole === 'SUPER_ADMIN') {
        storeId = req.query.storeId as string;
        if (Array.isArray(storeId)) {
          storeId = storeId[0];
        }
      } else {
        storeId = res.locals.store?.id;
        if (!storeId) {
          throw new ResponseError(404, 'Store ID not found in request');
        }
      }

      const { page, perPage, yearMonth, productSlug, storeSlug } = this.getFilters(req.query);
      const { mutations, totalCount } = await ReportService.getStockMutation(storeId || '', page, perPage, yearMonth || '', productSlug || '', storeSlug || '');

      return res.status(200).json({ status: 'OK', data: mutations, totalCount });
    } catch (error) {
      next(error);
    }
  };

  private getFilters(query: ParsedQs) {
    const page = parseInt(query.page as string) || 1;
    const perPage = parseInt(query.perPage as string) || 10;
    let yearMonth: string | undefined = query.yearMonth as string;
    let productSlug: string | undefined = query.productSlug as string;
    let storeSlug: string | undefined = query.storeSlug as string;

    if (Array.isArray(yearMonth)) {
      yearMonth = yearMonth[0];
    }
    if (Array.isArray(productSlug)) {
      productSlug = productSlug[0];
    }
    if (Array.isArray(storeSlug)) {
      storeSlug = storeSlug[0];
    }

    return { page, perPage, yearMonth, productSlug, storeSlug };
  }
}
