'use client';
import Image from 'next/image';
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
import { useAppDispatch, useAppSelector } from '@/lib/features/hooks';
import {
  deleteCartItem,
  fetchCartItemCount,
  updateCartItem,
  updateQuantity,
} from '@/lib/features/cart/cartSlice';
import { RootState } from '@/lib/features/store';
import { formatCurrency } from '@/lib/currency';
import { CartItemType } from '@/lib/types/cart';

interface CartItemProps {
  cart: CartItemType;
  isSelected: boolean;
  onSelect: (itemId: string) => void;
}
const CartItem: React.FC<CartItemProps> = ({ cart, isSelected, onSelect }) => {
  const [quantity, setQuantity] = useState(cart.quantity);
  const dispatch = useAppDispatch();
  const error = useAppSelector((state: RootState) => state.cart.error);

  useEffect(() => {
    setQuantity(cart.quantity);
  }, [cart.quantity]);

  if (!cart.stock || !cart.stock.product) {
    console.log('no cart stock');
    return null;
  }

  const { product } = cart.stock;
  const addressId = '11663abf-7a5b-4fa2-8503-53104311e924';

  const handleQuantityChange = async (newQuantity: number) => {
    console.log('newQuantity:', newQuantity);
    if (newQuantity === 0) {
      dispatch(deleteCartItem(cart.id));
    } else {
      try {
        const resultAction = await dispatch(
          updateCartItem({
            addressId: addressId,
            quantity: newQuantity,
            productId: cart.stock.product.id,
          }),
        );

        if (updateCartItem.fulfilled.match(resultAction)) {
          dispatch(updateQuantity({ id: cart.id, quantity: newQuantity }));
          dispatch(fetchCartItemCount());
        }
        setQuantity(newQuantity);
      } catch (error) {
        console.error('Update Cart Error:', error);
      }
    }
  };

  const handleRemove = async () => {
    // dispatch(deleteCartItem(cart.id));
    // dispatch(fetchCartItemCount());
    try {
      const resultAction = await dispatch(deleteCartItem(cart.id));
      if (deleteCartItem.fulfilled.match(resultAction)) {
        dispatch(fetchCartItemCount());
      }
    } catch (error) {
      console.error('Remove Cart Item Error:', error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col bg-card text-card-foreground shadow-md mb-4">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Checkbox
              id={cart.id}
              checked={isSelected}
              onCheckedChange={() => onSelect(cart.id)}
              onChange={() => onSelect(cart.id)}
            />
            <label
              htmlFor={cart.id}
              className="text-xl font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-3"
            >
              {product.title}
            </label>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3 items-center justify-between">
          <Image
            src={product.images[0]?.imageUrl || '/indomie.jpg'}
            width={50}
            height={50}
            alt="product image"
          />
          <p>{product.description}</p>
          <p>
            <strong>
              {cart.isPack
                ? formatCurrency(product.packPrice)
                : formatCurrency(product.price)}
            </strong>
          </p>
          <p>{cart.isPack ? 'grosir' : 'eceran'}</p>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="text-primary"
              onClick={() => handleQuantityChange(quantity - 1)}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="mx-2 text-lg">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="text-primary"
              onClick={() => handleQuantityChange(quantity + 1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="text-danger"
            onClick={handleRemove}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          {error && <p className="text-red-500">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default CartItem;
