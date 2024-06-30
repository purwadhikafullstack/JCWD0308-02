'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/features/hooks';
import { RootState } from '@/lib/features/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchCart } from '@/lib/features/cart/cartSlice';
import { addOrder } from '@/lib/fetch-api/order';
import OrderItem from './_component/OrderItem';
import ShippingAndDiscount from './_component/ShippingAndDiscount';
import Summary from './_component/Summary';
import { CartItemType } from '@/lib/types/cart';
import {
  UserAddressType,
  fetchAddresses,
  selectAddresses,
  selectSelectedAddressId,
} from '@/lib/features/address/addressSlice';
import { getUserProfile } from '@/lib/fetch-api/user/client';
import AdditionalInfo from './_component/AdditionalInfo';
import { mapCourierToUpperCase } from '@/lib/courierServices';

export default function OrderCustomer() {
  const dispatch = useAppDispatch();
  const carts = useAppSelector((state: RootState) => state.cart.items);
  // const productWeight = carts.stock.product.weight

  const [selectedItems, setSelectedItems] = useState<CartItemType[]>([]);
  const [shippingCourier, setShippingCourier] = useState<string>('');
  const [shippingMethod, setShippingMethod] = useState<string>('');
  const [discount, setDiscount] = useState<any>('');
  const [note, setNote] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [serviceDescription, setServiceDescription] = useState<string>('');

  const router = useRouter();
  const searchParams = useSearchParams();

  const addressesResponse: any = useAppSelector(selectAddresses) || {
    data: [],
  };
  const addresses = addressesResponse.data || [];
  const selectedAddressId = useAppSelector(selectSelectedAddressId) || '';
  const selectedAddress = addresses.find(
    (address: any) => address.id === selectedAddressId,
  );
  const cityId = selectedAddress ? selectedAddress.cityId : '';

  useEffect(() => {
    dispatch(fetchAddresses());
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    const selectedIds = searchParams.get('items')?.split(',') || [];
    const selectedCartItems = carts.filter((cart: CartItemType) =>
      selectedIds.includes(`${cart.id}-${cart.isPack}`),
    );
    setSelectedItems(selectedCartItems);
  }, [carts, searchParams]);

  const handleOrderSubmit = async () => {
    try {
      const orderData = {
        courier: mapCourierToUpperCase(shippingCourier),
        service: shippingMethod,
        serviceDescription,
        paymentMethod,
        addressId: selectedAddressId,
        note: note,
      };
      const response = await addOrder(orderData);
      console.log('Response:', response);

      if (response && response.data) {
        const newOrder = response.data;
        const paymentLink = newOrder.paymentLink;

        console.log('New Order:', newOrder);
        console.log('New Order id:', newOrder.id);
        console.log('Payment Link:', paymentLink);

        if (paymentMethod === 'GATEWAY' && newOrder) {
          router.push(`/orders/order-details/${newOrder.id}`);
        } else if (paymentMethod === 'MANUAL' && newOrder) {
          router.push(`/orders/payment-proof/${newOrder.id}`);
        } else {
          console.error('Unexpected response structure:', response);
        }
      } else {
        console.error('Unexpected response structure:', response);
      }
    } catch (error) {
      console.error('Failed to create order: ', error);
    }
  };

  const totalWeight = carts.reduce((acc, item) => {
    return (
      acc +
      item.quantity *
        (item.isPack
          ? item.stock.product.weightPack
          : item.stock.product.weight)
    );
  }, 0);

  return (
    <div className="container mx-auto mt-10 p-4">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="md:col-span-2">
          <div className="flex flex-col gap-6">
            <Card className="bg-card text-card-foreground shadow-lg rounded-lg">
              <CardHeader className="p-4">
                <CardTitle className="text-xl font-bold">
                  User Address
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p>
                  {selectedAddress
                    ? selectedAddress.address
                    : 'No address selected'}
                </p>
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
          <AdditionalInfo
            note={note}
            setNote={setNote}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </div>
        {/* Summary Section */}
        <Summary
          selectedItems={selectedItems}
          discount={discount}
          selectedAddress={selectedAddress}
          shippingCost={shippingCost}
        />
      </div>
      <div className="mt-6 text-center">
        <Button onClick={handleOrderSubmit} className="px-4 py-2">
          Place Order
        </Button>
      </div>
    </div>
  );
}
