"use client";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/features/hooks";
import { deleteCartItem, fetchCart, fetchCartItemCount, updateCartItem, updateQuantity } from "@/lib/features/cart/cartSlice";
import { formatCurrency } from "@/lib/currency";
import { CartItemType } from "@/lib/types/cart";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getSelectedAddress } from "@/lib/fetch-api/address/client";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/sonner";
import { getUserProfile } from "@/lib/fetch-api/user/client";

interface CartItemProps {
  cart: CartItemType;
  isSelected: boolean;
  onSelect: (itemId: string, isChecked: boolean) => void;
}
const CartItem: React.FC<CartItemProps> = ({ cart, isSelected, onSelect }) => {
  const router = useRouter();
  const selectedAddress = useSuspenseQuery({
    queryKey: ["selected-address"],
    queryFn: getSelectedAddress,
  });
  const userProfile = useSuspenseQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
  });

  if (!userProfile?.data?.user) {
    router.push("/auth/signin");
  }

  const [quantity, setQuantity] = useState(cart.quantity);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setQuantity(cart.quantity);
  }, [cart.quantity]);

  if (!cart.stock || !cart.stock.product) {
    return null;
  }

  const { product } = cart.stock;
  const addressId = selectedAddress.data?.address.id;
  if (!addressId) router.push("/cart");

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch(deleteCartItem(cart.id));
    } else {
      try {
        const resultAction = await dispatch(updateCartItem({ cartItemId: cart.id, stockId: cart.stock.id, quantity: newQuantity }));

        if (updateCartItem.fulfilled.match(resultAction)) {
          dispatch(updateQuantity({ id: cart.id, quantity: newQuantity }));
          dispatch(fetchCartItemCount());
        }
        setQuantity(newQuantity);
        if (newQuantity > cart.stock.amount) {
          toast.error(`Sorry, there are only ${cart.stock.amount} items available.`);
        }
      } catch (error) {
        console.error("Update Cart Error:", error);
      }
      dispatch(fetchCart());
    }
  };

  const handleRemove = async () => {
    try {
      const resultAction = await dispatch(deleteCartItem(cart.id));
      if (deleteCartItem.fulfilled.match(resultAction)) {
        dispatch(fetchCartItemCount());
      }
    } catch (error) {
      console.error("Remove Cart Item Error:", error);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 mb-4 sm:mb-0 w-full sm:w-auto">
          <Checkbox id={cart.id} checked={isSelected} onCheckedChange={() => onSelect(cart.id, !isSelected)} onChange={() => onSelect(cart.id, !isSelected)} />

          <figure className="max-w-[70%] sm:max-w-none sm:w-[90px] w-[60%]">
            <Image src={product.images[0]?.imageUrl || "/indomie.jpg"} width={50} height={50} alt="product image" />
          </figure>
        </div>
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left sm:flex-1">
          <p className="font-semibold "> {product.title}</p>
          <p className="text-gray-500">{cart.isPack ? "grosir" : "eceran"}</p>
          <p className="font-bold hidden max-md:flex"> {cart.isPack ? formatCurrency(product.packPrice) : formatCurrency(product.price)}</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:text-right text-center">
          <p className="font-bold max-md:hidden"> {cart.isPack ? formatCurrency(product.packPrice) : formatCurrency(product.price)}</p>
        </div>
      </div>
      <div className="flex justify-end items-center gap-2 mt-4">
        <Button variant="outline" size="icon" className="bg-destructive text-destructive-foreground" onClick={handleRemove}>
          <Trash className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" className="text-primary" onClick={() => handleQuantityChange(quantity - 1)}>
          <Minus className="w-4 h-4" />
        </Button>
        <span className="mx-2 text-lg">{cart.quantity}</span>
        <Button variant="outline" size="icon" className="text-primary" onClick={() => handleQuantityChange(quantity + 1)}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <Separator className="my-4" />
      <Toaster />
    </div>
  );
};

export default CartItem;
