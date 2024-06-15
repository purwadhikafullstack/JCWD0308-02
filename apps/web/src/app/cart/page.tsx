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
import React from 'react';

export default function Cart() {
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
          <div className="flex flex-col gap-4">
            <Card className="flex flex-col bg-card text-card-foreground shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Checkbox id="indomie" />
                  <label
                    htmlFor="indomie"
                    className="text-xl font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-3"
                  >
                    Indomie
                  </label>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="flex-1 mr-4">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Accusantium officia ab, ducimus repudiandae dolorum et eveniet
                  ex fugit quis eligendi eius minima sit. Reiciendis, sequi!
                  Voluptatem consectetur mollitia harum eum?
                </p>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-primary"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="mx-2 text-lg">1</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-primary"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </CardFooter>
            </Card>
            {/* Repeat similar cards for other items */}
          </div>
        </div>
        {/* Summary Section */}
        <Card className="bg-card text-card-foreground shadow-lg flex flex-col h-full rounded-lg">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg mb-3">
            <CardTitle className="text-3xl font-bold">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>$45.00</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax</span>
              <span>$3.60</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>$48.60</span>
            </div>
          </CardContent>
          <CardFooter className="mt-auto p-4">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary-dark">
              Checkout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
