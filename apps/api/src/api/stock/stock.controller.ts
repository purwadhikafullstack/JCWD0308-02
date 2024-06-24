import { Request, Response } from 'express';
import { StockService } from './stock.service.js';
import { ResponseError } from '@/utils/error.response.js';

export class StockController {
  addStock = async (req: Request, res: Response) => {
    try {
      const { productId, storeId, amount } = req.body;
      const stock = await StockService.addStock(productId, storeId, amount);
      res.status(201).json({ status: 'OK', stock });
    } catch (error) {
      if (error instanceof ResponseError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res
          .status(500)
          .json({ status: 'Error', message: 'Internal Server Error' });
      }
    }
  };

  getStock = async (req: Request, res: Response) => {
    try {
      const { stockId } = req.params;
      const stock = await StockService.getStock(stockId);
      res.status(200).json(stock);
    } catch (error) {
      if (error instanceof ResponseError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  };

  postStockId = async (req: Request, res: Response) => {
    try {
      const { productId, addressId } = req.body;
      const userId = res.locals.user?.id;
      const stockId = await StockService.postStockId(
        productId,
        addressId,
        userId,
      );
      res.status(200).json({ stockId });
    } catch (error) {
      if (error instanceof ResponseError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  };
}
