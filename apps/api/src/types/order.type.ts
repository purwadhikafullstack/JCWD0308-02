import { ResponseError } from '@/utils/error.response.js';
import { CourierType } from '@prisma/client';

export interface OrderRequest {
  addressId?: any;
  paymentMethod: string;
  courier: string;
  service: string;
  note?: string;
  userVoucherId?: string;
  // serviceDescription?: string;
}

export interface OrderId {
  orderId: string;
}

export const mapCourierTypeToRajaOngkir = (
  courierType: CourierType,
): string => {
  switch (courierType) {
    case CourierType.JNE:
      return 'jne';
    case CourierType.POS:
      return 'pos';
    case CourierType.TIKI:
      return 'tiki';
    default:
      throw new ResponseError(400, 'Invalid courier type');
  }
};

export const getCourierType = (courier: string): CourierType => {
  switch (courier.toUpperCase()) {
    case 'JNE':
      return CourierType.JNE;
    case 'POS':
      return CourierType.POS;
    case 'TIKI':
      return CourierType.TIKI;
    default:
      throw new ResponseError(400, 'Invalid courier type');
  }
};

export interface ChangeStatusRequest {
  orderId: string;
  newStatus: string;
}
