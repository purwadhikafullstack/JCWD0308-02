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
import { getAllOrders } from '@/lib/fetch-api/order';
import { Order } from '@/lib/types/order';

export default function ListOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrdersData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllOrders();
        console.log('data from admin orders:', response);

        // Ensure data is an array
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
                      <TableCell>{order.orderStatus}</TableCell>
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
