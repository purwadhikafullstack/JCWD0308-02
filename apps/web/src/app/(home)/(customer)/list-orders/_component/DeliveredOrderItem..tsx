'use client';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/currency';
import { confirmOrder } from '@/lib/fetch-api/order';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface OrderItemProps {
  order: {
    id: string;
    updatedAt: string;
    orderItems: {
      isPack: string;
      id: any;
      stock: {
        product: {
          price: number;
          packQuantity: any;
          packPrice: number;
          images: string[];
          title: string;
        };
      };
      quantity: number;
    }[];
  };
}

const DeliveredOrderItem: React.FC<OrderItemProps> = ({ order }) => {
  const [confirmed, setConfirmed] = useState(false);
  const router = useRouter();
  const handleConfirmOrder = async () => {
    try {
      await confirmOrder({ orderId: order.id });

      setConfirmed(true);

      window.location.reload();
    } catch (error) {
      console.error('Error confirming order:', error);
    }
  };
  return (
    <div className="border rounded-lg p-4 mb-4 shadow-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Order details */}
        <div className="flex-1">
          <div className="text-lg font-semibold mb-2">
            <span className="text-gray-700">Order ID:</span> {order.id}
          </div>
          <div className="text-sm text-gray-600 mb-2">
            <span className="text-gray-700">Date of Order:</span>{' '}
            {new Date(order.updatedAt).toLocaleDateString()}
          </div>
        </div>

        {/* Product details */}
        {order.orderItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4 md:flex-1 mt-4">
            <div className="w-16 h-16 relative">
              <Image
                src={item.stock.product.images[0] || '/indomie.jpg'}
                layout="fill"
                objectFit="cover"
                alt="Product Image"
                className="rounded-lg -z-[999rem]"
              />
            </div>
            <div>
              <p className="text-lg font-medium">{item.stock.product.title}</p>
              <p className="text-gray-600">
                Quantity: {item.quantity}{' '}
                {item.isPack && `(Pack of ${item.stock.product.packQuantity})`}
              </p>
              <p className="text-gray-600">
                Price:{' '}
                {formatCurrency(
                  item.isPack
                    ? item.stock.product.packPrice
                    : item.stock.product.price,
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
      {!confirmed && (
        <Button type="button" onClick={handleConfirmOrder}>
          Confirm
        </Button>
      )}
      {confirmed && <p className="text-green-600">Order Confirmed!</p>}
    </div>
  );
};

export default DeliveredOrderItem;
