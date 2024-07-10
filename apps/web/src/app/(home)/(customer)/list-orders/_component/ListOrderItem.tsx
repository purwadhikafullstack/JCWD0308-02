'use client';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/currency';
import { OrderItemProps } from '@/lib/types/order';
import Image from 'next/image';
import React from 'react';

const ListOrderItem: React.FC<OrderItemProps> = ({ order }) => {
  return (
    <div className="border rounded-lg p-4 mb-4 shadow-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex-1">
          <div className="text-lg font-semibold mb-1">
            <span className="text-gray-700">Order Number:</span> {order.id}
          </div>
          <div className="text-sm text-gray-600 mb-1">
            <span className="text-gray-700">Date Placed:</span>{' '}
            {new Date(order.updatedAt).toLocaleDateString()}
          </div>
          <div className="text-sm text-gray-600 mb-1">
            <span className="text-gray-700">Total Amount:</span>{' '}
            {formatCurrency(order.totalPayment)}
          </div>
        </div>
      </div>

      {order.orderItems.map((item) => (
        <div
          key={item.id}
          className="flex flex-col md:flex-row items-start gap-4 border-t pt-4 mt-4"
        >
          <div className="w-24 h-24 relative">
            <Image
              src={item.stock.product.images[0] || '/indomie.jpg'}
              layout="fill"
              objectFit="cover"
              alt="Product Image"
              className="rounded-lg"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-medium">
                  {item.stock.product.title}
                </p>
                <p className="text-gray-600 text-sm">
                  {item.stock.product.description}
                </p>
              </div>
              <p className="text-lg font-medium">
                {formatCurrency(
                  item.isPack
                    ? item.stock.product.packPrice
                    : item.stock.product.price,
                )}
              </p>
            </div>
            <p className="text-gray-600 text-sm mt-2">
              Quantity: {item.quantity}
              {item.isPack && ` (Pack of ${item.stock.product.packQuantity})`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListOrderItem;
