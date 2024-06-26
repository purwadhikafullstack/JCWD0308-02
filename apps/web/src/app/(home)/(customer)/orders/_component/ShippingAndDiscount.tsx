import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Percent, Truck } from 'lucide-react';

interface ShippingAndDiscountProps {
  shippingCourier: string;
  setShippingCourier: (method: string) => void;
  shippingMethod: string;
  setShippingMethod: (method: string) => void;
  discount: string;
  setDiscount: (method: string) => void;
}

const ShippingAndDiscount: React.FC<ShippingAndDiscountProps> = ({
  shippingCourier,
  setShippingCourier,
  shippingMethod,
  setShippingMethod,
  discount,
  setDiscount,
}) => {
  return (
    <div className="flex gap-3">
      <Card className="bg-card text-card-foreground shadow-lg rounded-lg flex-1">
        <CardHeader className="flex items-center p-4 bg-accent text-accent-foreground rounded-t-lg">
          <Truck className="w-5 h-5 mr-2" />
          <CardTitle className="text-xl font-bold">Shipping</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="mb-4">
            <label
              htmlFor="shippingCourier"
              className="block text-sm font-medium text-gray-700"
            >
              Shipping Courier
            </label>
            <select
              id="shippingCourier"
              value={shippingCourier}
              onChange={(e) => setShippingCourier(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md"
            >
              <option value="">Select Shipping Courier</option>
              <option value="JNE">JNE</option>
              <option value="TIKI">TIKI</option>
              <option value="POS">POS</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="shippingMethod"
              className="block text-sm font-medium text-gray-700"
            >
              Shipping Method
            </label>
            <select
              id="shippingMethod"
              value={shippingMethod}
              onChange={(e) => setShippingMethod(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md"
            >
              <option value="">Select Shipping Method</option>
              <option value="REG">REG</option>
              <option value="YES">YES</option>
            </select>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card text-card-foreground shadow-lg rounded-lg flex-1">
        <CardHeader className="flex items-center p-4 bg-accent text-accent-foreground rounded-t-lg">
          <Percent className="w-5 h-5 mr-2" />
          <CardTitle className="text-xl font-bold">Discount Coupon</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p>Use discount codes to save more.</p>
          <select
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Discount</option>
          </select>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingAndDiscount;
