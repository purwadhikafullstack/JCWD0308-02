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
import { Percent, Truck } from 'lucide-react';
import { calculateShippingCost } from '@/lib/fetch-api/shipping';
import { courierServices, formattedCourierNames } from '@/lib/courierServices';
import { formatCurrency } from '@/lib/currency';
import { getVouchers } from '@/lib/fetch-api/voucher';

interface ShippingAndDiscountProps {
  shippingCourier: string;
  setShippingCourier: (method: string) => void;
  shippingMethod: string;
  setShippingMethod: (method: string) => void;
  discount: string;
  setDiscount: (method: string) => void;
  cityId: number;
  totalWeight: number;
  shippingCost: number | null;
  setShippingCost: (cost: number | null) => void;
  setServiceDescription: (description: string) => void;
}

const ShippingAndDiscount: React.FC<ShippingAndDiscountProps> = ({
  shippingCourier,
  setShippingCourier,
  shippingMethod,
  setShippingMethod,
  discount,
  setDiscount,
  cityId,
  totalWeight,
  shippingCost,
  setShippingCost,
  setServiceDescription,
}) => {
  const [shippingEstimation, setShippingEstimation] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchShippingCost = async () => {
      if (shippingCourier && shippingMethod && cityId) {
        try {
          const data = {
            origin: 23,
            destination: cityId,
            weight: totalWeight,
            courier: shippingCourier,
          };
          const result = await calculateShippingCost(data);
          setShippingCost(result.cost);
          setShippingEstimation(result.estimation);
        } catch (error) {
          console.error('Failed to fetch shipping cost:', error);
          alert('There is no this shipping service to your destination');
        }
      }
    };

    fetchShippingCost();
  }, [shippingCourier, shippingMethod, cityId, totalWeight, setShippingCost]);

  const handleCourierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCourier = e.target.value;
    setShippingCourier(selectedCourier);
    setShippingMethod('');
  };

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMethod = e.target.value;
    const selectedService = courierServices[shippingCourier].find(
      (service) => service.service === selectedMethod,
    );
    setShippingMethod(selectedMethod);
    setServiceDescription(selectedService?.description || '');
  };

  const [productVouchers, setProductVouchers] = useState([]);
  const [shippingVouchers, setShippingVouchers] = useState([]);
  const [selectedProductVoucher, setSelectedProductVoucher] = useState('');
  const [selectedShippingVoucher, setSelectedShippingVoucher] = useState('');

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const vouchers = await getVouchers();
      const productVouchersList = vouchers.filter(
        (voucher: any) => voucher.voucherType === 'PRODUCT',
      );
      const shippingVouchersList = vouchers.filter(
        (voucher: any) => voucher.voucherType === 'SHIPPING COST',
      );
      setProductVouchers(productVouchersList);
      setShippingVouchers(shippingVouchersList);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    }
  };

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
              onChange={handleCourierChange}
              className="mt-1 block w-full p-2 border rounded-md"
            >
              <option value="">Select Shipping Courier</option>
              {Object.keys(courierServices).map((courier) => (
                <option key={courier} value={courier}>
                  {formattedCourierNames[courier] || courier}
                </option>
              ))}
            </select>
          </div>
          {shippingCourier && (
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
                onChange={handleMethodChange}
                className="mt-1 block w-full p-2 border rounded-md"
              >
                <option value="">Select Shipping Method</option>
                {courierServices[shippingCourier].map((service) => (
                  <option key={service.service} value={service.service}>
                    {service.service} - {service.description}
                  </option>
                ))}
              </select>
            </div>
          )}
          {shippingCost !== null && (
            <div className="mt-4">
              <p>Shipping Cost: {formatCurrency(shippingCost)}</p>
              <p>Estimation: {shippingEstimation} days</p>
            </div>
          )}
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
            value={selectedProductVoucher}
            onChange={(e) => setSelectedProductVoucher(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Discount Product</option>
            {productVouchers.map((voucher: any) => (
              <option key={voucher.id} value={voucher.id}>
                {voucher.name}
              </option>
            ))}
          </select>
          <select
            value={selectedShippingVoucher}
            onChange={(e) => setSelectedShippingVoucher(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Discount Shipping Cost</option>
            {shippingVouchers.map((voucher: any) => (
              <option key={voucher.id} value={voucher.id}>
                {voucher.name}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingAndDiscount;
