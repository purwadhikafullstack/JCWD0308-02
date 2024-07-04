'use client';
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getOrdersByStatus } from '@/lib/fetch-api/order';
import { OrderStatusMap } from '@/lib/types/order';
import Image from 'next/image';
import ListOrderItem from './_component/ListOrderItem';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DeliveredOrderItem from './_component/DeliveredOrderItem.';
import AwaitingPayment from './_component/AwaitingPayment';
import { Calendar, Search } from 'lucide-react';

export default function ListOrdersPage() {
  const [orders, setOrders] = useState<OrderStatusMap>({
    awaiting_payment: [],
    awaiting_confirmation: [],
    process: [],
    shipping: [],
    delivered: [],
    confirmed: [],
    cancelled: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        const awaitingPaymentOrders = await getOrdersByStatus(
          'awaiting_payment',
          searchTerm,
          selectedDate?.toISOString(),
        );
        console.log('awaitingpaymentorders:', awaitingPaymentOrders);
        const awaitingConfirmationOrders = await getOrdersByStatus(
          'awaiting_confirmation',
          searchTerm,
          selectedDate?.toISOString(),
        );
        const processOrders = await getOrdersByStatus(
          'process',
          searchTerm,
          selectedDate?.toISOString(),
        );
        const shippingOrders = await getOrdersByStatus(
          'shipping',
          searchTerm,
          selectedDate?.toISOString(),
        );
        const deliveredOrders = await getOrdersByStatus(
          'delivered',
          searchTerm,
          selectedDate?.toISOString(),
        );
        const confirmedOrders = await getOrdersByStatus(
          'confirmed',
          searchTerm,
          selectedDate?.toISOString(),
        );
        console.log('confirmedOrders:', confirmedOrders);
        const cancelledOrders = await getOrdersByStatus(
          'cancelled',
          searchTerm,
          selectedDate?.toISOString(),
        );

        setOrders({
          awaiting_payment: awaitingPaymentOrders.data,
          awaiting_confirmation: awaitingConfirmationOrders.data,
          process: processOrders.data,
          shipping: shippingOrders.data,
          delivered: deliveredOrders.data,
          confirmed: confirmedOrders.data,
          cancelled: cancelledOrders.data,
        });
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrdersData();
  }, [searchTerm, selectedDate]);

  const filteredOrders = (status: keyof OrderStatusMap) => {
    return orders[status].filter((order: any) => {
      const matchesSearch = searchTerm
        ? order.id.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const matchesDate = selectedDate
        ? new Date(order.updatedAt).toDateString() ===
          selectedDate.toDateString()
        : true;
      return matchesSearch && matchesDate;
    });
  };

  return (
    <div className="mx-4 lg:mx-10 mt-4 flex flex-col gap-2 justify-center">
      <div className="mb-4 flex w-screen justify-center gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Order ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-xl pl-10"
          />
          <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
        </div>
        <div className="relative">
          <DatePicker
            selected={selectedDate}
            placeholderText="       Select a Date"
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd-MM-yyyy"
            className="border p-2 rounded-xl"
          />
          <Calendar className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>
      <div className="flex justify-center items-center">
        <Tabs defaultValue="awaiting_payment" className="max-w-[70rem]">
          <TabsList className="flex justify-center mb-4 max-sm:mb-10 flex-wrap">
            <TabsTrigger value="awaiting_payment" className="px-4 py-2">
              Awaiting Payment
            </TabsTrigger>
            <TabsTrigger value="awaiting_confirmation" className="px-4 py-2">
              Awaiting Confirmation
            </TabsTrigger>
            <TabsTrigger value="process" className="px-4 py-2">
              Process
            </TabsTrigger>
            <TabsTrigger value="shipping" className="px-4 py-2">
              Shipping
            </TabsTrigger>
            <TabsTrigger value="delivered" className="px-4 py-2">
              Delivered
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="px-4 py-2">
              Confirmed
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="px-4 py-2">
              Cancelled
            </TabsTrigger>
          </TabsList>

          {/* Tabs Content */}
          <TabsContent value="awaiting_payment">
            {filteredOrders('awaiting_payment').map((order) => (
              <AwaitingPayment key={order.id} order={order} />
            ))}
          </TabsContent>

          <TabsContent value="awaiting_confirmation">
            {filteredOrders('awaiting_confirmation').map((order) => (
              <ListOrderItem key={order.id} order={order} />
            ))}
          </TabsContent>

          <TabsContent value="process">
            {filteredOrders('process').map((order) => (
              <ListOrderItem key={order.id} order={order} />
            ))}
          </TabsContent>

          <TabsContent value="shipping">
            {filteredOrders('shipping').map((order) => (
              <ListOrderItem key={order.id} order={order} />
            ))}
          </TabsContent>

          <TabsContent value="delivered">
            {filteredOrders('delivered').map((order) => (
              <DeliveredOrderItem key={order.id} order={order} />
            ))}
          </TabsContent>
          <TabsContent value="confirmed">
            {filteredOrders('confirmed').map((order) => (
              <ListOrderItem key={order.id} order={order} />
            ))}
          </TabsContent>
          <TabsContent value="cancelled">
            {filteredOrders('cancelled').map((order) => (
              <ListOrderItem key={order.id} order={order} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
