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
import { Trash2, Minus, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getCart } from '@/lib/fetch-api/cart';
import CartItem from './_component/CartItem';
import { useAppDispatch, useAppSelector } from '@/lib/features/hooks';
import { setCart } from '@/lib/features/cart/cartSlice';
import { RootState } from '@/lib/features/store';
import { formatCurrency } from '@/lib/currency';
import Link from 'next/link';
import { CartItemType } from '@/lib/types/cart';

export default function Cart() {
  const dispatch = useAppDispatch();
  const carts = useAppSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cartData = await getCart();
        dispatch(setCart(cartData.data));
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };
    fetchCartData();
  }, [dispatch]);

  function calculateSubtotal(items: CartItemType[]) {
    return items.reduce((acc, item) => {
      if (!item.stock) {
        console.log('no stock for item:', item.id);
        return acc;
      }

      const price = item.isPack
        ? item.stock.product?.packPrice ?? 0
        : item.stock.product?.price ?? 0;

      return acc + item.quantity * price;
    }, 0);
  }

  const subtotal = useAppSelector((state: RootState) =>
    calculateSubtotal(state.cart.items),
  );
  return (
    <div className="container mx-auto mt-10 p-4 min-h-[40rem]">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Shopping List */}
        <div className="md:col-span-2">
          <Card className="p-4 flex items-center mb-4">
            <Checkbox id="select-all" />
            <label htmlFor="select-all" className="text-xl font-bold ml-3">
              Select All
            </label>
          </Card>
          {carts.map((cart: any) => (
            <CartItem key={`${cart.id}-${cart.isPack}`} cart={cart} />
          ))}
        </div>
        {/* Summary Section */}
        <Card className="bg-card text-card-foreground shadow-lg flex flex-col h-full rounded-lg">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg mb-3">
            <CardTitle className="text-3xl font-bold">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </CardContent>
          <CardFooter className="mt-auto p-4">
            <Link
              href="/customer/order"
              className="w-full bg-primary text-primary-foreground hover:bg-primary-dark p-3 text-center rounded-lg"
            >
              Checkout
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
