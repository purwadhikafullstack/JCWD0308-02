import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CartItemType } from '@/lib/types/cart';

interface CartItemProps {
  cart: CartItemType;
}
const OrderItem: React.FC<CartItemProps> = ({ cart }) => {
  return (
    <div>
      <Card
        key={`${cart.id}-${cart.isPack}`}
        className="bg-card text-card-foreground shadow-lg rounded-lg"
      >
        <CardHeader className="p-4">
          <CardTitle className="flex items-center">
            {cart.stock.product.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between p-4 gap-4">
          <p className="flex-1 mr-4">{cart.stock.product.description}</p>
          <p>Type: {cart.isPack ? 'grosir' : 'eceran'}</p>
          <p>
            Price:{' '}
            {cart.isPack
              ? cart.stock.product.packPrice
              : cart.stock.product.price}
          </p>
        </CardContent>
        <CardFooter className="flex gap-2 justify-end p-4">
          <span className="mx-2 text-lg">Quantity: {cart.quantity}</span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrderItem;
