'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import { confirmPaymentByAdmin, getAllOrders } from '@/lib/fetch-api/order';
import { Order } from '@/lib/types/order';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useRouter } from 'next/navigation';

export default function ListOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrdersData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllOrders();
        if (response.status === 'OK' && Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          throw new Error('Data is not an array or status is not OK');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersData();
  }, []);
  const handleStatusChange = (orderId: string, newStatus: string) => {
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure to change the order status?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => confirmPaymentStatus(orderId, newStatus),
        },
        {
          label: 'No',
        },
      ],
    });
  };

  const confirmPaymentStatus = async (orderId: string, newStatus: any) => {
    try {
      const response = await confirmPaymentByAdmin(orderId, newStatus);
      if (response.status === 'OK') {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  orderStatus: newStatus,
                }
              : order,
          ),
        );
      } else {
        throw new Error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status');
      setTimeout(() => {
        setError(null);
        router.push('/dashboard/orders');
      }, 2000);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      <p>Manage your orders here.</p>
      <div className="mt-4">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableCaption>A list of orders of all users</TableCaption>
                <TableHeader>
                  <TableRow>
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
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>
                        {[
                          'AWAITING_CONFIRMATION',
                          'PROCESS',
                          'AWAITING_PAYMENT',
                        ].includes(order.orderStatus) ? (
                          <select
                            className="bg-gray-300 p-3 rounded-full"
                            value={order.orderStatus}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value)
                            }
                          >
                            <option value="AWAITING_CONFIRMATION">
                              Awaiting Confirmation
                            </option>
                            <option value="PROCESS">Process</option>
                            <option value="AWAITING_PAYMENT">
                              Awaiting Payment
                            </option>
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
                      <TableCell>{order.paymentPicture}</TableCell>
                      <TableCell>{order.storeId}</TableCell>
                      <TableCell>{order.storeAdminId}</TableCell>
                      <TableCell>{order.isDeleted ? 'Yes' : 'No'}</TableCell>
                      <TableCell>
                        {order.deletedAt
                          ? new Date(order.deletedAt).toLocaleDateString()
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {new Date(order.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
