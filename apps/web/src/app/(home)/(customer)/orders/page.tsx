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

export default function OrderCustomer() {
  const dispatch = useAppDispatch();
  const carts = useAppSelector((state: RootState) => state.cart.items);
  // const productWeight = carts.stock.product.weight

  const [selectedItems, setSelectedItems] = useState<CartItemType[]>([]);
  const [shippingCourier, setShippingCourier] = useState<string>('');
  const [shippingMethod, setShippingMethod] = useState<string>('');
  const [discount, setDiscount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('MANUAL');
  const [shippingCost, setShippingCost] = useState<number | null>(null);

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
        courier: shippingCourier,
        service: shippingMethod,
        serviceDescription: 'Layanan Reguler',
        paymentMethod,
        addressId: selectedAddressId,
        note: note,
      };
      const newOrder = await addOrder(orderData);
      console.log('New Order:', newOrder);

      if (paymentMethod === 'MANUAL') {
        router.push('/order/payment-proof');
      } else {
        router.push('/orders');
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
            />
          </div>
        </div>
        {/* Summary Section */}
        <Summary
          selectedItems={selectedItems}
          selectedAddress={selectedAddress}
          shippingCost={shippingCost}
        />
      </div>
    </div>
  );
}
