
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { getUserProfile } from "@/lib/fetch-api/user/client";
import AdditionalInfo from "./_component/AdditionalInfo";
import { mapCourierToUpperCase } from "@/lib/courierServices";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getSelectedAddress } from "@/lib/fetch-api/address/client";
import { addOrder } from "@/lib/fetch-api/order";


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
  const [discount, setDiscount] = useState<any>("");
  const [note, setNote] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [serviceDescription, setServiceDescription] = useState<string>("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const addressId = selectedAddress.data?.address.id;
  const cityId = selectedAddress.data?.address.cityId;

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
        note: note,
      };
      const response = await addOrder(orderData);
      console.log("Response:", response);

      if (response && response.data) {
        const newOrder = response.data;
        const paymentLink = newOrder.paymentLink;
        if (paymentMethod === "GATEWAY" && newOrder) {

          router.push(`/orders/order-details/${newOrder.id}`);
        } else if (paymentMethod === "MANUAL" && newOrder) {
          router.push(`/orders/payment-proof/${newOrder.id}`);
        } else {
          console.error("Unexpected response structure:", response);
        }
        const selectedIds = selectedItems.map((item) => `${item.id}-${item.isPack}`);
        dispatch(removeSelectedItems(selectedIds));
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (error) {
      console.error("Failed to create order: ", error);
    }
  };

  const totalWeight = carts.reduce((acc, item) => {
    return acc + item.quantity * (item.isPack ? item.stock.product.weightPack : item.stock.product.weight);
  }, 0);

  return (
    <div className="container mx-auto mt-10 p-4">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="md:col-span-2">
          <div className="flex flex-col gap-6">
            <Card className="bg-white text-gray-800 shadow-lg rounded-lg">
              <CardHeader className="p-4 bg-primary text-primary-foreground rounded-t-lg">
                <CardTitle className="text-xl font-bold">User Address</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="font-bold">{selectedAddress.data?.address ? selectedAddress.data.address.labelAddress : "There is no address"}</p>
                <p>{selectedAddress.data?.address.address}</p>
                <p>
                  {selectedAddress.data?.address.city?.name}, {selectedAddress.data?.address.city?.postalCode}

                </p>
                <p>Note: {selectedAddress?.data?.address?.note}</p>
              </CardContent>
            </Card>
            {/* Cart Items */}
            {selectedItems.map((cart: any) => (
              <OrderItem key={`${cart.id}-${cart.isPack}`} cart={cart} />
            ))}
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
            />
          </div>
          {/* Additional Info */}
          <AdditionalInfo note={note} setNote={setNote} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
        </div>
        {/* Summary Section */}
        <Summary selectedItems={selectedItems} discount={discount} selectedAddress={selectedAddress} shippingCost={shippingCost} />
      </div>
      <div className="mt-6 text-center">
        <Button onClick={handleOrderSubmit} className="px-4 py-2 w-full bg-primary text-white rounded-lg shadow-md">

          Place Order
        </Button>
      </div>
    </div>
  );
}
