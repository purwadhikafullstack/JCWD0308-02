'use client';
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/currency';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getSelectedAddress } from '@/lib/fetch-api/address/client';

interface SummaryProps {
  selectedItems: any[];
  discount: number;
  selectedAddress: any;
  shippingCost: number | null;
}
const Summary: React.FC<SummaryProps> = ({
  selectedItems,
  discount,
  selectedAddress,
  shippingCost,
}) => {
  const selectAddress = useSuspenseQuery({
    queryKey: ['selected-address'],
    queryFn: getSelectedAddress,
  });
  const calculateSubtotal = () => {
    let subtotal = 0;
    selectedItems.forEach((item) => {
      let itemPrice = item.isPack
        ? item.stock.product.packPrice
        : item.stock.product.price;

      if (item.quantity && typeof itemPrice === 'number' && !isNaN(itemPrice)) {
        subtotal += item.quantity * itemPrice;
      } else {
        console.warn(`Invalid item found: ${JSON.stringify(item)}`);
      }
    });
    return subtotal;
  };

  const subtotal = calculateSubtotal();
  const discountedSubtotal = subtotal - (discount || 0);
  const total = (shippingCost || 0) + discountedSubtotal;

  console.log(subtotal);
  return (
    <Card className="bg-card text-card-foreground shadow-lg flex flex-col h-full rounded-lg">
      <CardHeader className="bg-primary text-primary-foreground p-4 rounded-t-lg">
        <CardTitle className="text-3xl font-bold">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-4">Order Details</h1>
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>
            {shippingCost !== null
              ? formatCurrency(shippingCost)
              : 'Not yet calculated'}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between mb-2">
            <span>Discount</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <hr className="my-4 border-primary" />
        <h1 className="text-2xl font-bold mb-4">Shipping Information</h1>
        <div className="flex justify-between mb-2">
          <span>Name</span>
          <span>{selectedAddress.data?.address?.recipientName}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Address</span>
          <span className="ml-3">{selectedAddress.data?.address?.address}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>City</span>
          <span>{selectedAddress.data?.address?.city?.name}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Postal Code</span>
          <span>{selectedAddress.data?.address?.city?.postalCode}</span>
        </div>
        <hr className="my-4 border-primary" />
        <h1 className="text-2xl font-bold mb-4">Customer Information</h1>
        <div className="flex justify-between mb-2">
          <span>Phone</span>
          <span className="ml-3">{selectedAddress.data?.address?.phone}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Email</span>
          <span className="ml-3">{selectedAddress.data?.address?.email}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Summary;
