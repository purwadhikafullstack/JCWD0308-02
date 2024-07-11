"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/features/hooks";
import { RootState } from "@/lib/features/store";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchCart, removeSelectedItems } from "@/lib/features/cart/cartSlice";
import OrderItem from "./_component/OrderItem";
import ShippingAndDiscount from "./_component/ShippingAndDiscount";
import Summary from "./_component/Summary";
import { CartItemType } from "@/lib/types/cart";
import { fetchAddresses } from "@/lib/features/address/addressSlice";
import AdditionalInfo from "./_component/AdditionalInfo";
import { mapCourierToUpperCase } from "@/lib/courierServices";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getSelectedAddress } from "@/lib/fetch-api/address/client";
import { addOrder } from "@/lib/fetch-api/order";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/sonner";

export default function OrderCustomer() {
  const dispatch = useAppDispatch();
  const carts = useAppSelector((state: RootState) => state.cart.items);
  const selectedAddress = useSuspenseQuery({
    queryKey: ["selected-address"],
    queryFn: getSelectedAddress,
  });

  const [selectedItems, setSelectedItems] = useState<CartItemType[]>([]);
  const [shippingCourier, setShippingCourier] = useState<string>("");
  const [shippingMethod, setShippingMethod] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [note, setNote] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [serviceDescription, setServiceDescription] = useState<string>("");
  const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(null);
  const [selectedVoucherName, setSelectedVoucherName] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const addressId = selectedAddress.data?.address?.id;
  const cityId = selectedAddress.data?.address?.cityId;

  useEffect(() => {
    dispatch(fetchAddresses());
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    const selectedIds = searchParams.getAll("items");
    const selectedCartItems = carts.filter((cart: CartItemType) => selectedIds.includes(`${cart.id}-${cart.isPack}`));
    setSelectedItems(selectedCartItems);
  }, [carts, searchParams]);

  const handleOrderSubmit = async () => {
    try {
      const orderData = {
        courier: mapCourierToUpperCase(shippingCourier),
        service: shippingMethod,
        serviceDescription,
        paymentMethod,
        addressId,
        note,
        discountId: selectedVoucherId,
      };
      const response = await addOrder(orderData);
      if (response && response.data) {
        const newOrder = response.data;
        if (paymentMethod === "GATEWAY" && newOrder) {
          router.push(`/orders/order-details/${newOrder.id}`);
        } else if (paymentMethod === "MANUAL" && newOrder) {
          router.push(`/orders/payment-proof/${newOrder.id}`);
        } else {
          console.error("Unexpected response structure:", response);
        }
        const selectedIds = selectedItems.map((item) => `${item.id}-${item.isPack}`);
        dispatch(removeSelectedItems(selectedIds));
        toast.success("Order success!");
      } else {
        console.error("Unexpected response structure:", response);
        toast.error("Unexpected response structure");
      }
    } catch (error) {
      console.error("Failed to create order: ", error);
      toast.error("Failed to create order");
    }
  };

  const totalWeight = carts.reduce((acc: any, item) => {
    return acc + item.quantity * (item.isPack ? item.stock.product.weightPack : item.stock.product.weight);
  }, 0);

  const handleSelectVoucher = (voucherId: string, voucherName: string, voucherDiscount: number) => {
    setSelectedVoucherId(voucherId);
    setSelectedVoucherName(voucherName);
    setDiscount(voucherDiscount);
  };

  return (
    <div className="max-w-7xl mx-auto p-5">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2">
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-xl border-2 border-[#a1a3b5] p-6 shadow-lg">
              <h1 className="text-xl font-semibold mb-4">User Address</h1>
              <Separator className="mb-4" />
              <div className="p-4">
                <p className="font-bold">{selectedAddress.data?.address ? selectedAddress.data.address.labelAddress : "There is no address"}</p>
                <p>{selectedAddress.data?.address.address}</p>
                <p>
                  {selectedAddress.data?.address.city?.name}, {selectedAddress.data?.address.city?.postalCode}
                </p>
                <p>Note: {selectedAddress?.data?.address?.note}</p>
              </div>
            </div>
            {/* Cart Items */}
            <div className="border-2 border-[#a1a3b5] rounded-xl">
              <h1 className="text-xl font-semibold my-4 ml-4">Cart Items</h1>
              {selectedItems.map((cart: any) => (
                <OrderItem key={`${cart.id}-${cart.isPack}`} cart={cart} />
              ))}
            </div>
            {/* Shipping And Discount */}
            <ShippingAndDiscount
              shippingCourier={shippingCourier}
              setShippingCourier={setShippingCourier}
              shippingMethod={shippingMethod}
              setShippingMethod={setShippingMethod}
              discount={discount}
              setDiscount={setDiscount}
              cityId={cityId}
              totalWeight={totalWeight}
              shippingCost={shippingCost}
              setShippingCost={setShippingCost}
              setServiceDescription={setServiceDescription}
              onVoucherSelect={handleSelectVoucher}
              selectedItems={selectedItems}
            />
          </div>
          {/* Additional Info */}
          <AdditionalInfo note={note} setNote={setNote} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
        </div>
        {/* Summary Section */}
        <div className="grid gap-5 grid-summary">
          <Summary selectedItems={selectedItems} discount={discount} selectedAddress={selectedAddress} shippingCost={shippingCost} />
          <div className="flex max-md:hidden"></div>
        </div>
      </div>
      <div className="mt-6 text-center">
        <Button onClick={handleOrderSubmit} className="px-4 py-2 w-full bg-primary text-white rounded-lg shadow-md">
          Place Order
        </Button>
      </div>
      <Toaster />
    </div>
  );
}
