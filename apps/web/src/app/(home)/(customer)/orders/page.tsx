'use client';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus, Truck, Percent } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/features/hooks';
import { RootState } from '@/lib/features/store';
import { useRouter } from 'next/navigation';
import { fetchCart } from '@/lib/features/cart/cartSlice';
import { addOrder } from '@/lib/fetch-api/order';
import OrderItem from './_component/OrderItem';
import ShippingAndDiscount from './_component/ShippingAndDiscount';
import Summary from './_component/Summary';

export default function OrderCustomer() {
  const dispatch = useAppDispatch();
  const carts = useAppSelector((state: RootState) => state.cart.items);
  const [shippingCourier, setShippingCourier] = useState<string>('');
  const [shippingMethod, setShippingMethod] = useState<string>('');
  const [discount, setDiscount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('MANUAL');
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleOrderSubmit = async () => {
    try {
      const orderData = {
        courier: shippingCourier,
        service: shippingMethod,
        serviceDescription: 'Layanan Reguler',
        paymentMethod,
        addressId: '11663abf-7a5b-4fa2-8503-53104311e924',
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
                <p>Jalan jalani saja dulu no.sekian</p>
              </CardContent>
            </Card>
            {/* Cart Items */}
            {carts.map((cart: any) => (
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
            />
          </div>
        </div>
        {/* Summary Section */}
        <Summary />
      </div>
    </div>
  );
}
