import { ICallback } from '@/types/index.js';

import { ResponseError } from '@/utils/error.response.js';
import { OrderService } from './order.service.js';
import { OrderStatus } from '@prisma/client';
import { ConfirmPaymentRequest } from '@/types/order.type.js';

export class OrderController {
  addOrder: ICallback = async (req, res, next) => {
    try {
      const order = await OrderService.addOrder(req.body, res);
      return res.status(201).json({ status: 'OK', data: order });
    } catch (error) {
      next(error);
    }
  };
  getOrdersByStoreAdmin: ICallback = async (req, res, next) => {
    try {
      const { storeAdminId } = req.params;
      const order = await OrderService.getOrdersByStoreAdmin(storeAdminId);
      return res.status(201).json({ status: 'OK', data: order });
    } catch (error) {
      next(error);
    }
  };
  getAllOrders: ICallback = async (req, res, next) => {
    try {
      const { storeId } = req.params;
      const order = await OrderService.getAllOrders(storeId);
      return res.status(201).json({ status: 'OK', data: order });
    } catch (error) {
      next(error);
    }
  };
  getOrder: ICallback = async (req, res, next) => {
    try {
      const userId = res.locals?.user?.id!;
      const { date, status } = req.query;
      const orderStatus = status as OrderStatus | undefined;
      const order = await OrderService.getOrder(userId, {
        date: date as string,
        status: orderStatus,
      });
      return res.status(200).json({ status: 'OK', data: order });
    } catch (error) {
      next(error);
    }
  };
  cancelOrder: ICallback = async (req, res, next) => {
    try {
      const order = await OrderService.cancelOrder(req.body, res);
      return res.status(201).json({ status: 'OK', data: order });
    } catch (error) {
      next(error);
    }
  };
  uploadProof: ICallback = async (req, res, next) => {
    const { orderId } = req.params;
    try {
      if (!req.file) throw new ResponseError(401, 'No file uploaded!');
      console.log('File:', req.file);
      const filePath = await OrderService.uploadProof(
        orderId,
        req?.file,
        req,
        res,
      );
      return res.status(200).json({ status: 'OK', data: filePath });
    } catch (error) {
      next(error);
    }
  };
  confirmPayment: ICallback = async (req, res, next) => {
    try {
      const confirmPaymentRequest: ConfirmPaymentRequest = req.body;
      const result = await OrderService.confirmPayment(
        confirmPaymentRequest,
        res,
      );
      return res.status(200).json({ status: 'OK', data: result });
    } catch (error) {
      next(error);
    }
  };
  sendUserOrders: ICallback = async (req, res, next) => {
    try {
      const order = await OrderService.sendUserOrders(req.body, res);
      return res.status(200).json({ status: 'OK', data: order });
    } catch (error) {
      next(error);
    }
  };
  confirmOrder: ICallback = async (req, res, next) => {
    try {
      const order = await OrderService.confirmOrder(req.body, res);
      return res.status(200).json({ status: 'OK', data: order });
    } catch (error) {
      next(error);
    }
  };
  cancelOrderByAdmin: ICallback = async (req, res, next) => {
    try {
      const order = await OrderService.cancelOrderByAdmin(req.body, res);
      return res.status(200).json({ status: 'OK', data: order });
    } catch (error) {
      next(error);
    }
  };
}
