"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";

interface SummaryProps {
  selectedItems: any[];
  discount: number;
  selectedAddress: any;
  shippingCost: number | null;
}

const Summary: React.FC<SummaryProps> = ({ selectedItems, discount, selectedAddress, shippingCost }) => {
  const calculateSubtotal = () => {
    let subtotal = 0;
    selectedItems.forEach((item) => {
      let itemPrice = item.isPack ? item.stock.product.packPrice : item.stock.product.price;

      if (item.quantity && typeof itemPrice === "number" && !isNaN(itemPrice)) {
        subtotal += item.quantity * itemPrice;
      }
    });
    return subtotal;
  };

  const subtotal = calculateSubtotal();
  const validDiscount = typeof discount === "number" && !isNaN(discount) ? discount : 0;
  const discountedSubtotal = subtotal - validDiscount;
  const total = (shippingCost || 0) + discountedSubtotal;
  const totalDiscount = discount;

  return (
    <Card className="bg-card text-card-foreground shadow-lg flex flex-col h-full rounded-lg">
      <CardHeader className="bg-primary text-primary-foreground p-4 rounded-t-lg">
        <CardTitle className="text-3xl font-bold">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {shippingCost !== null && (
          <div className="flex justify-between mt-2">
            <span>Shipping Cost:</span>
            <span>{formatCurrency(shippingCost)}</span>
          </div>
        )}
        {totalDiscount > 0 && (
          <div className="flex justify-between mt-2">
            <span>Discount:</span>
            <span>-{formatCurrency(totalDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between mt-2 font-bold">
          <span>Total:</span>
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
