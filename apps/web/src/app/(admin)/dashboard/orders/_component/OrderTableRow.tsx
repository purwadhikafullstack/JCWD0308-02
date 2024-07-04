import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TableRow, TableCell } from '@/components/ui/table';
import { Order } from '@/lib/types/order';
import React from 'react';
type OrderTableRowProps = {
  index: number;
  order: Order;
  handleStatusChange: (orderId: string, newStatus: string) => void;
};

export const OrderTableRow: React.FC<OrderTableRowProps> = ({
  index,
  order,
  handleStatusChange,
}) => (
  <TableRow>
    <TableCell>{index + 1}</TableCell>
    <TableCell>{order.id}</TableCell>
    <TableCell>
      {[
        'AWAITING_PAYMENT',
        'AWAITING_CONFIRMATION',
        'PROCESS',
        'SHIPPING',
        'DELIVERED',
        'CANCELLED',
      ].includes(order.orderStatus) ? (
        <select
          className="bg-gray-300 p-2 rounded-xl"
          value={order.orderStatus}
          onChange={(e) => handleStatusChange(order.id, e.target.value)}
        >
          <option value="AWAITING_PAYMENT">Awaiting Payment</option>
          <option value="AWAITING_CONFIRMATION">Awaiting Confirmation</option>
          <option value="PROCESS">Process</option>
          <option value="SHIPPING">Shipping</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      ) : (
        <span>{order.orderStatus}</span>
      )}
    </TableCell>
    <TableCell>{order.userId}</TableCell>
    <TableCell>{order.courier}</TableCell>
    <TableCell>{order.service}</TableCell>
    <TableCell>{order.serviceDescription}</TableCell>
    <TableCell>{order.estimation}</TableCell>
    <TableCell>{order.note}</TableCell>
    <TableCell>{order.paymentMethod}</TableCell>
    <TableCell>{order.totalPrice}</TableCell>
    <TableCell>{order.shippingCost}</TableCell>
    <TableCell>{order.discountProducts}</TableCell>
    <TableCell>{order.discountShippingCost}</TableCell>
    <TableCell>{order.totalPayment}</TableCell>
    <TableCell>
      {order.paymentPicture ? (
        <Dialog>
          <DialogTrigger className="text-primary">Open</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{order.paymentPicture}</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ) : (
        ''
      )}
    </TableCell>
    <TableCell>{order.storeId}</TableCell>
    <TableCell>{order.storeAdminId}</TableCell>
    <TableCell>{order.isDeleted ? 'Yes' : 'No'}</TableCell>
    <TableCell>
      {order.deletedAt ? new Date(order.deletedAt).toLocaleDateString() : 'N/A'}
    </TableCell>
    <TableCell>{new Date(order.updatedAt).toLocaleDateString()}</TableCell>
    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
  </TableRow>
);
