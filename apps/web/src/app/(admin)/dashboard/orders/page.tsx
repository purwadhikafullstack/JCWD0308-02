'use client';

import React, { useEffect, useState } from 'react';
import { confirmPaymentByAdmin, getAllOrders } from '@/lib/fetch-api/order';
import { Order } from '@/lib/types/order';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useRouter } from 'next/navigation';
import { OrderTable } from './_component/OrderTable';
import { PaginationDemo } from './_component/Pagination';

export default function ListOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const perPage = 10;
  const router = useRouter();

  useEffect(() => {
    const fetchOrdersData = async (page: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllOrders(page, perPage);
        if (response.status === 'OK' && Array.isArray(response.data)) {
          setOrders(response.data);
          setTotalPages(Math.ceil(response.totalCount / perPage));
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

    fetchOrdersData(currentPage);
  }, [currentPage]);
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-lg max-md:max-w-screen-md  max-sm:max-w-screen-sm">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Orders</h2>
      <div className="mt-4">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <OrderTable
              orders={orders}
              handleStatusChange={handleStatusChange}
            />
          </div>
        )}
      </div>
      <div className="mt-4">
        <PaginationDemo
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
