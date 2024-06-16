import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';

export default function CardItem() {
  return (
    <div className="my-6 ml-6">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Indomie Goreng</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <figure>
            <Image src="/indomie.jpg" width={250} height={250} alt="product" />
          </figure>
          <p>Mie enak digoreng</p>
          <p>
            Harga Satuan: <strong>Rp3000</strong>
          </p>
          <p>
            Harga 1 Pak (40 buah): <strong>Rp50.000</strong>
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="default">+ Add to Cart</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
