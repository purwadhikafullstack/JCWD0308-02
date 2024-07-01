'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getOrder } from '@/lib/fetch-api/order';
import { Order } from '@/lib/types/order';
import { formatCurrency } from '@/lib/currency';

const OrderDetailPage = () => {
  // const { orderId } = params;
  const { orderId } = useParams();
  console.log('params orderId:', orderId);
  console.log('orderId type:', typeof orderId);
  const [order, setOrder] = useState<Order | null>(null);
  console.log('poing');
  useEffect(() => {
    const fetchOrder = async () => {
      console.log('start fetching order...');
      if (!orderId) return;
      try {
        const response = await getOrder(orderId as string);
        setOrder(response);
        console.log('response:', response);
      } catch (error) {
        console.error('error getting response:', error);
      }
    };
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('order:', order);
  if (!order) return <p>Loading...</p>;

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-4">Order Details</h1>
      <p className="text-lg">Order ID: {order.data?.id}</p>
      <p className="text-lg">
        Total Payment: {formatCurrency(order.data?.totalPayment)}
      </p>
      <br />
      {order.data?.paymentLink && (
        <a
          href={order.data?.paymentLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 text-white px-6 py-3 mt-5 rounded-full shadow-md hover:bg-blue-600 transition duration-300"
        >
          Pay Now
        </a>
      )}
    </div>
  );
};

export default OrderDetailPage;
