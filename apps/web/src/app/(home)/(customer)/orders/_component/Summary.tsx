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
import { calculateShippingCost } from '@/lib/fetch-api/shipping';
const Summary = () => {
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [shippingEstimation, setShippingEstimation] = useState<string | null>(
    null,
  );
  const [nearestStore, setNearestStore] = useState<string>('');
  const [userAddress, setUserAddress] = useState<string>('');
  const [weight, setWeight] = useState<number>();
  const [shippingCourier, setShippingCourier] = useState<string>('');

  // useEffect(() => {
  //     const calculateTotals = async () => {
  //       try {
  //         const { cost, estimation } = await calculateShippingCost(
  //           nearestStore,
  //           userAddress,
  //           weight,
  //           shippingCourier
  //         );
  //         setShippingCost(cost);
  //       } catch (error) {
  //         console.error('Failed to calculate shipping:', error);
  //       }
  //     };

  //     if (shippingCourier && userAddress) {
  //       calculateTotals();
  //     }
  //   }, [shippingCourier, userAddress, nearestStore, weight]);

  return (
    <Card className="bg-card text-card-foreground shadow-lg flex flex-col h-full rounded-lg">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
        <CardTitle className="text-3xl font-bold">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">Order Details</h1>
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>$45.00</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <span>$3.60</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>$5.00</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>$53.60</span>
        </div>
        <hr className="my-4 border-primary" />
        <h1 className="text-2xl font-bold mb-4">Shipping Information</h1>
        <div className="flex justify-between mb-2">
          <span>Name</span>
          <span>Zafer Ekren</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Address</span>
          <span className="ml-3">Jalan jalani saja dulu no.sekian</span>
        </div>
        <h1 className="text-2xl font-bold mb-4">Customer Information</h1>
        <div className="flex justify-between mb-2">
          <span>Email</span>
          <span className="ml-3">zafere@mail.com</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Phone</span>
          <span className="ml-3">0811111111</span>
        </div>
      </CardContent>
      <CardFooter className="mt-auto p-4">
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary-dark">
          Choose Payment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Summary;
