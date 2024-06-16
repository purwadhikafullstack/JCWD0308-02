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
import React from 'react';

export default function OrderCustomer() {
  return (
    <div className="container mx-auto mt-10 p-4">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="md:col-span-2">
          <div className="flex flex-col gap-6">
            <Card className="bg-card text-card-foreground shadow-lg rounded-lg">
              <CardHeader className="p-4">
                <CardTitle className="text-xl font-bold">Ekren House</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p>Jalan jalani saja dulu no.sekian</p>
              </CardContent>
            </Card>
            <Card className="bg-card text-card-foreground shadow-lg rounded-lg">
              <CardHeader className="p-4">
                <CardTitle className="flex items-center">Indomie</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between p-4">
                <p className="flex-1 mr-4">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Accusantium officia ab, ducimus repudiandae dolorum et eveniet
                  ex fugit quis eligendi eius minima sit. Reiciendis, sequi!
                  Voluptatem consectetur mollitia harum eum?
                </p>
              </CardContent>
              <CardFooter className="flex gap-2 justify-end p-4">
                <span className="mx-2 text-lg">Quantity:</span>
                <span className="mx-2 text-lg">1</span>
              </CardFooter>
            </Card>
            <div className="flex gap-3">
              <Card className="bg-card text-card-foreground shadow-lg rounded-lg flex-1">
                <CardHeader className="flex items-center p-4 bg-accent text-accent-foreground rounded-t-lg">
                  <Truck className="w-5 h-5 mr-2" />
                  <CardTitle className="text-xl font-bold">
                    Shipping Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p>Select your preferred shipping method.</p>
                </CardContent>
              </Card>
              <Card className="bg-card text-card-foreground shadow-lg rounded-lg flex-1">
                <CardHeader className="flex items-center p-4 bg-accent text-accent-foreground rounded-t-lg">
                  <Percent className="w-5 h-5 mr-2" />
                  <CardTitle className="text-xl font-bold">
                    Discount Coupon
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p>Use discount codes to save more.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        {/* Summary Section */}
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
      </div>
    </div>
  );
}
