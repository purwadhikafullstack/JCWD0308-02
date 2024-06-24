'use client';
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
import { Product } from './type';
import { formatCurrency } from '@/lib/currency';

interface CardItemProps {
  product: Product;
  addToCart: (productId: string, isPack: boolean) => void;
}

export const CardItem: React.FC<CardItemProps> = ({ product, addToCart }) => {
  const handleAddToCart = (isPack: boolean) => {
    addToCart(product.id, isPack);
  };
  return (
    <div className="my-6 ml-6">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>{product.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <figure>
            <Image src="/indomie.jpg" width={250} height={250} alt="product" />
          </figure>
          <p>{product.description}</p>
          <p>
            Harga Satuan: <strong>{formatCurrency(product.price)}</strong>
          </p>
          <p>
            Harga 1 Pak (40 buah):{' '}
            <strong>{formatCurrency(product.packPrice)}</strong>
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="default" onClick={() => handleAddToCart(false)}>
            + Add to Cart
          </Button>
          <Button variant="default" onClick={() => handleAddToCart(true)}>
            + Add Pack to Cart
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
