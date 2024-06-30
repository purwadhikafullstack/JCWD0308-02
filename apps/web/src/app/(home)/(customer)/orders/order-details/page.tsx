'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getOrder } from '@/lib/fetch-api/order';
import { Order } from '@/lib/types/order';

const OrderDetail = ({ params }: { params: { orderId: string } }) => {
  const { orderId } = params;
  console.log('params orderId:', orderId);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const response = await getOrder(orderId);
      setOrder(response.data);
    };
    fetchOrder();
  }, [orderId]);

  if (!order) return <p>Loading...</p>;

  return (
    <div>
      <h1>Order Details</h1>
      <p>Order ID: {order.id}</p>
      <p>Total Payment: {order.totalPayment}</p>
      {order.paymentLink && (
        <p>
          Payment Link:{' '}
          <a href={order.paymentLink} target="_blank" rel="noopener noreferrer">
            Pay Now
          </a>
        </p>
      )}
    </div>
  );
};

export default OrderDetail;
