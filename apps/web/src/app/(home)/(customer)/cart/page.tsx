"use client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import React, { FormEventHandler, useEffect, useState } from "react";
import Image from "next/image";
import { checkCart, getCart } from "@/lib/fetch-api/cart";
import CartItem from "./_component/CartItem";
import { useAppDispatch, useAppSelector } from "@/lib/features/hooks";
import { setCart } from "@/lib/features/cart/cartSlice";
import { RootState } from "@/lib/features/store";
import { formatCurrency } from "@/lib/currency";
import { useRouter } from "next/navigation";
import { CartItemType } from "@/lib/types/cart";

export default function Cart() {
  const dispatch = useAppDispatch();
  const carts = useAppSelector((state: RootState) => state.cart.items);
  const [selectedItem, setSelectedItems] = useState<{ [key: string]: boolean }>({});
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cartData = await getCart();
        const updatedCartData = cartData.data.map((item: CartItemType) => ({
          ...item,
          isChecked: false,
        }));
        dispatch(setCart(updatedCartData));
        console.log("cartData:", updatedCartData);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    fetchCartData();
  }, [dispatch]);

  function calculateSubtotal(items: CartItemType[]) {
    return items.reduce((acc, item) => {
      if (!item.stock) {
        console.log("no stock for item:", item.id);
        return acc;
      }
      const key = `${item.id}-${item.isPack}`;
      if (selectedItem[key]) {
        const price = item.isPack ? item.stock.product.packPrice ?? 0 : item.stock.product.price ?? 0;

        return acc + item.quantity * price;
      }

      return acc;
    }, 0);
  }

  const subtotal = useAppSelector((state: RootState) => calculateSubtotal(state.cart.items));

  const handleSelectAll = () => {
    const newSelectedItems: { [key: string]: boolean } = {};
    if (!selectAll) {
      carts.forEach((cart: CartItemType) => {
        const key = `${cart.id}-${cart.isPack}`;
        newSelectedItems[key] = true;
      });
    }
    setSelectedItems(newSelectedItems);
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    const initialSelectedItems: { [key: string]: boolean } = {};
    carts.forEach((cart: CartItemType) => {
      initialSelectedItems[`${cart.id}-${cart.isPack}`] = cart.isChecked || false;
    });
    setSelectedItems(initialSelectedItems);
  }, [carts]);

  const handleSelectedItem = async (itemId: string, isPack: boolean) => {
    const key = `${itemId}-${isPack}`;
    const newSelectedItems = {
      ...selectedItem,
      [key]: !selectedItem[key],
    };
    setSelectedItems(newSelectedItems);
    try {
      await checkCart(itemId, newSelectedItems[key]);
      console.log(`Item ${itemId} isChecked updated to ${newSelectedItems[key]}`);
    } catch (error) {
      console.error("Error updating isChecked:", error);
    }

    const allSelectedManually = carts.every((cart: CartItemType) => newSelectedItems[`${cart.id}-${cart.isPack}`]);
    setSelectAll(allSelectedManually);
  };

  const handleCheckout = () => {
    const selectedCarts = Object.keys(selectedItem).filter((key) => selectedItem[key]);
    const selectedItems = carts.filter((cart: any) => selectedCarts.includes(`${cart.id}-${cart.isPack}`));

    if (selectedItems.length > 0) {
      const queryString = selectedItems.map((item) => `items=${item.id}-${item.isPack}`).join("&");
      router.push(`/orders?${queryString}`);
    }
  };
  return (
    <div className="container mx-auto mt-10 p-4 min-h-[40rem]">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Shopping List */}
        <div className="md:col-span-2">
          <Card className="p-4 flex items-center mb-4">
            <Checkbox id="select-all" onChange={handleSelectAll} onCheckedChange={handleSelectAll} checked={selectAll} />
            <label htmlFor="select-all" className="text-xl font-bold ml-3">
              Select All
            </label>
          </Card>
          {carts.map((cart: any) => (
            <CartItem key={`${cart.id}-${cart.isPack}`} cart={cart} isSelected={selectedItem[`${cart.id}-${cart.isPack}`] || false} onSelect={() => handleSelectedItem(cart.id, cart.isPack)} />
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
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary-dark p-3 text-center rounded-lg" onClick={handleCheckout}>
              Checkout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
