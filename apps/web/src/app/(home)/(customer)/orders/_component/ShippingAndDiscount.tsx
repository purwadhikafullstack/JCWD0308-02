"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Percent, Truck } from "lucide-react";
import { calculateShippingCost } from "@/lib/fetch-api/shipping";
import { courierServices, formattedCourierNames } from "@/lib/courierServices";
import { formatCurrency } from "@/lib/currency";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getNearestStocks } from "@/lib/fetch-api/stocks/client";
import VoucherDrawer from "./VoucherDrawer";

interface ShippingAndDiscountProps {
  shippingCourier: string;
  setShippingCourier: (method: string) => void;
  shippingMethod: string;
  setShippingMethod: (method: string) => void;
  discount: string;
  setDiscount: (method: string) => void;
  cityId: any;
  totalWeight: number;
  shippingCost: number | null;
  setShippingCost: (cost: number | null) => void;
  setServiceDescription: (description: string) => void;
}

const ShippingAndDiscount: React.FC<ShippingAndDiscountProps> = ({ shippingCourier, setShippingCourier, shippingMethod, setShippingMethod, discount, setDiscount, cityId, totalWeight, shippingCost, setShippingCost, setServiceDescription }) => {
  const nearestStocks = useSuspenseQuery({
    queryKey: ["nearest-stocks", 1, 15, ""],
    queryFn: async ({ queryKey }) => {
      const filters = Object.fromEntries(new URLSearchParams(String("")));
      return getNearestStocks(Number(1), Number(15), filters);
    },
  });
  const [shippingEstimation, setShippingEstimation] = useState<string | null>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const origin = nearestStocks?.data?.store?.cityId;

  useEffect(() => {
    const fetchShippingCost = async () => {
      if (shippingCourier && shippingMethod && cityId) {
        try {
          const data = {
            origin,
            destination: cityId,
            weight: totalWeight,
            courier: shippingCourier,
          };
          const result = await calculateShippingCost(data);
          setShippingCost(result.cost);
          setShippingEstimation(result.estimation);
        } catch (error) {
          console.error("Failed to fetch shipping cost:", error);
        }
      }
    };

    fetchShippingCost();
  }, [shippingCourier, shippingMethod, cityId, totalWeight, setShippingCost, origin]);

  const handleCourierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCourier = e.target.value;
    setShippingCourier(selectedCourier);
    setShippingMethod("");
  };

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMethod = e.target.value;
    const selectedService = courierServices[shippingCourier].find((service) => service.service === selectedMethod);
    setShippingMethod(selectedMethod);
    setServiceDescription(selectedService?.description || "");
  };

  const handleSelectVoucher = (voucherId: string, voucherName: string) => {
    setDiscount(voucherId);
    setSelectedVoucherName(voucherName);
  };

  const [selectedVoucherName, setSelectedVoucherName] = useState<string | null>(null);

  const calculateDiscount = () => {
    if (!selectedVoucher) return 0;
    if (selectedVoucher.discountType === "DISCOUNT") {
      return (selectedVoucher.discount / 100) * (shippingCost || 0);
    }
    if (selectedVoucher.discountType === "FIXED_DISCOUNT") {
      return selectedVoucher.fixedDiscount;
    }
    return 0;
  };

  const discountAmount = calculateDiscount();
  const subtotal = (shippingCost || 0) - discountAmount;

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <Card className="bg-white text-gray-800 shadow-lg rounded-lg flex-1">
        <CardHeader className="flex items-center p-4 bg-secondary text-secondary-foreground rounded-t-lg">
          <Truck className="w-5 h-5 mr-2" />
          <CardTitle className="text-xl font-bold">Shipping</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="mb-4">
            <label htmlFor="shippingCourier" className="block text-sm font-medium text-gray-700">
              Shipping Courier
            </label>
            <select id="shippingCourier" value={shippingCourier} onChange={handleCourierChange} className="mt-1 block w-full p-2 border rounded-md">
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
              <label htmlFor="shippingMethod" className="block text-sm font-medium text-gray-700">
                Shipping Method
              </label>
              <select id="shippingMethod" value={shippingMethod} onChange={handleMethodChange} className="mt-1 block w-full p-2 border rounded-md">
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
      <Card className="bg-white text-gray-800 shadow-lg rounded-lg flex-1">
        <CardHeader className="flex items-center p-4 bg-secondary text-secondary-foreground rounded-t-lg">
          <Percent className="w-5 h-5 mr-2" />
          <CardTitle className="text-xl font-bold">Discount Coupon</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p>Use discount codes to save more.</p>
          <VoucherDrawer onSelectVoucher={handleSelectVoucher} />
          {selectedVoucherName && (
            <div className="mt-4">
              <p>Selected Voucher: {selectedVoucherName}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingAndDiscount;
