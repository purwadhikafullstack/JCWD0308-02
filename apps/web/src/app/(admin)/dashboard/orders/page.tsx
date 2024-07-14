'use client';

import React, { useState } from 'react';
import { cancelOrderByAdmin, confirmPaymentByAdmin, getAllOrders, sendOrder } from '@/lib/fetch-api/order';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { OrderTable } from './_component/OrderTable';
import { PaginationDemo } from './_component/Pagination';
import { useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getSelectedStore } from '@/lib/fetch-api/store/client';
import { getUserProfile } from '@/lib/fetch-api/user/client';
import { Toast } from '@/components/ui/toast';
import { toast } from '@/components/ui/sonner';

export default function ListOrdersPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const perPage = 10;
  const queryClient = useQueryClient();

  const { data: selectedStoreData } = useSuspenseQuery({
    queryKey: ['store'],
    queryFn: getSelectedStore,
  });
  const storeId = selectedStoreData?.store?.id;
  const userProfile = useSuspenseQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
  });

  const superAdminOnly = userProfile.data?.user?.role === 'SUPER_ADMIN';

  const {
    data: ordersData,
    isLoading,
    isError,
  } = useSuspenseQuery({
    queryKey: ['orders', currentPage],
    queryFn: () => {
      return getAllOrders(currentPage, perPage);
    },
  });

  const orders = ordersData?.data || [];
  const totalPages = Math.ceil((ordersData?.totalCount || 0) / perPage);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure to change the order status?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            if (superAdminOnly) {
              confirmPaymentStatus(orderId, newStatus);
            } else {
              if (newStatus === 'CANCELLED') {
                cancelOrderAdmin(orderId);
              } else {
                sendOrderAdmin(orderId, newStatus);
              }
            }
          },
        },
        {
          label: 'No',
        },
      ],
    });
  };

  const confirmPaymentStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await confirmPaymentByAdmin(orderId, newStatus);
      if (response.status === 'OK') {
        queryClient.invalidateQueries(['orders', { currentPage, storeId }] as any);
      } else {
        throw new Error('Failed to update order status');
      }
    } catch (error) {
      toast.error(`You are not authorized to change the status to ${newStatus}`);
      console.error(error);
    }
  };

  const sendOrderAdmin = async (orderId: string, newStatus: string) => {
    try {
      const response = await sendOrder(orderId, newStatus);
      if (response.status === 'OK') {
        queryClient.invalidateQueries(['orders', currentPage, storeId] as any);
      } else {
        throw new Error('Failed to update order status');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const cancelOrderAdmin = async (orderId: string) => {
    try {
      const response = await cancelOrderByAdmin(orderId);
      console.log('response from frontend:', response);
      if (response.status === 'OK') {
        queryClient.invalidateQueries(['orders', currentPage, storeId] as any);
      } else {
        throw new Error('Failed to cancel order');
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-md">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Orders</h2>
      <div className="mt-4">
        {isLoading ? (
          <div className="h-screen flex justify-center items-center">
            <span className="loader"></span>
          </div>
        ) : isError ? (
          <p className="text-red-500">Error: Failed to fetch orders.</p>
        ) : (
          <div className="overflow-x-auto">
            <OrderTable orders={orders} handleStatusChange={handleStatusChange} />
          </div>
        )}
      </div>
      <div className="mt-4">
        <PaginationDemo currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}
