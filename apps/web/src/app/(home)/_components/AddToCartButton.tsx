'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { addCartItem, addToCart } from '@/lib/features/cart/cartSlice';
import { useAppDispatch } from '@/lib/features/hooks';
import { CartRequestType } from '@/lib/types/cart';
import { ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
  productId: string;
  isPack: boolean;
  addressId: string | undefined;
  stockId: string | undefined;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  isPack,
  addressId,
  stockId,
}) => {
  const dispatch = useAppDispatch();
  const [addToCartIndex, setAddToCartIndex] = useState(0);

  const handleAddToCart = () => {
    try {
      const cartRequest: any = {
        productId,
        quantity: 1,
        isPack,
        addressId,
        stockId: stockId || '',
      };

      dispatch(addCartItem(cartRequest))
        .unwrap()
        .then((response) => {
          dispatch(addToCart(response));
          alert('Product added to cart!');
        })
        .catch((error) => {
          console.error('Error adding product to cart:', error);
        });
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  return (
    <Button
      className="rounded-full flex items-center justify-center text-white"
      onClick={handleAddToCart}
      variant="default"
    >
      <ShoppingCart size={13} />
    </Button>
  );
};

export default AddToCartButton;
