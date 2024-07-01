import { Order } from '@/lib/types/order';
import { OrderTableRow } from './OrderTableRow';
import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@/components/ui/table';

interface OrderTableProps {
  orders: Order[];
  handleStatusChange: (orderId: any, newStatus: string) => void;
}
export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  handleStatusChange,
}) => (
  <div className="overflow-x-auto">
    <Table className="min-w-full">
      <TableCaption>A list of orders of all users</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>No.</TableHead>
          <TableHead>ID</TableHead>
          <TableHead>Order Status</TableHead>
          <TableHead>User ID</TableHead>
          <TableHead>Courier</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Service Description</TableHead>
          <TableHead>Estimation of Arrival</TableHead>
          <TableHead>Note</TableHead>
          <TableHead>Payment Method</TableHead>
          <TableHead>Total Price</TableHead>
          <TableHead>Shipping Cost</TableHead>
          <TableHead>Discount Products</TableHead>
          <TableHead>Discount Shipping Cost</TableHead>
          <TableHead>Total Payment</TableHead>
          <TableHead>Payment Picture</TableHead>
          <TableHead>Store ID</TableHead>
          <TableHead>Store Admin ID</TableHead>
          <TableHead>Is Deleted</TableHead>
          <TableHead>Deleted At</TableHead>
          <TableHead>Updated At</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order, index) => (
          <OrderTableRow
            key={order.id}
            order={order}
            handleStatusChange={handleStatusChange}
            index={index}
          />
        ))}
      </TableBody>
    </Table>
  </div>
);
