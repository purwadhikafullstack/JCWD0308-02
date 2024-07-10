"use client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { checkCart, getCart } from "@/lib/fetch-api/cart";
import CartItem from "./_component/CartItem";
import { useAppDispatch, useAppSelector } from "@/lib/features/hooks";
import { setCart } from "@/lib/features/cart/cartSlice";
import { RootState } from "@/lib/features/store";
import { formatCurrency } from "@/lib/currency";
import { useRouter } from "next/navigation";
import { CartItemType } from "@/lib/types/cart";
import { Separator } from "@/components/ui/separator";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getNearestStocks } from "@/lib/fetch-api/stocks/client";
import { Alert } from "@/components/ui/alert";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/sonner";
import { getUserProfile } from "@/lib/fetch-api/user/client";

export default function Cart() {
  const dispatch = useAppDispatch();
  const carts = useAppSelector((state: RootState) => state.cart.items);
  const [selectedItem, setSelectedItems] = useState<{ [key: string]: boolean }>({});
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [isCheckoutDisabled, setIsCheckoutDisabled] = useState<boolean>(true);
  const router = useRouter();
  const nearestStocks = useSuspenseQuery({
    queryKey: ["nearest-stocks", 1, 15, ""],
    queryFn: async ({ queryKey }) => {
      const filters = Object.fromEntries(new URLSearchParams(String("")));
      return getNearestStocks(Number(1), Number(15), filters);
    },
  });

  const userProfile = useSuspenseQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
  });

  if (!userProfile?.data?.user) {
    router.push('/auth/signin')
  }

  const isServiceAvailable = nearestStocks.data?.isServiceAvailable ?? false;

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cartData = await getCart();
        const updatedCartData = cartData.data.map((item: CartItemType) => ({
          ...item,
          isChecked: false,
        }));
        dispatch(setCart(updatedCartData));
        toast.success("Cart Updated!");
      } catch (error) {
        console.error("Error fetching cart data:", error);
        toast.error("Error fetching cart data.");
      }
    };
    fetchCartData();
  }, [dispatch]);

  function calculateSubtotal(items: CartItemType[]) {
    return items.reduce((acc, item) => {
      const key = `${item.id}-${item.isPack !== undefined ? item.isPack.toString() : "missing"}`;
      if (selectedItem[key]) {
        const price = item.isPack ? item.stock.product.packPrice : item.stock.product.price;
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
        const key = `${cart.id}-${cart.isPack !== undefined ? cart.isPack.toString() : "missing"}`;
        newSelectedItems[key] = true;
      });
    }
    setSelectedItems(newSelectedItems);
    setSelectAll(!selectAll);
    setIsCheckoutDisabled(!Object.values(newSelectedItems).some((isSelected) => isSelected));
  };

  useEffect(() => {
    const initialSelectedItems: { [key: string]: boolean } = {};
    carts.forEach((cart: CartItemType) => {
      initialSelectedItems[`${cart.id}-${cart.isPack !== undefined ? cart.isPack.toString() : "missing"}`] = cart.isChecked || false;
    });
    setSelectedItems(initialSelectedItems);
    setIsCheckoutDisabled(!Object.values(initialSelectedItems).some((isSelected) => isSelected));
  }, [carts]);

  const handleSelectedItem = async (itemId: string, isPack: boolean) => {
    const key = `${itemId}-${isPack !== undefined ? isPack.toString() : "missing"}`;
    const newSelectedItems = { ...selectedItem, [key]: !selectedItem[key] };
    setSelectedItems(newSelectedItems);
    setIsCheckoutDisabled(!Object.values(newSelectedItems).some((isSelected) => isSelected));
    try {
      await checkCart(itemId, newSelectedItems[key]);
      console.log(`Item ${itemId} isChecked updated to ${newSelectedItems[key]}`);
    } catch (error) {
      console.error("Error updating isChecked:", error);
    }

    const allSelectedManually = carts.every((cart: CartItemType) => newSelectedItems[`${cart.id}-${cart.isPack !== undefined ? cart.isPack.toString() : "missing"}`]);
    setSelectAll(allSelectedManually);
  };

  const handleCheckout = () => {
    const selectedCarts = Object.keys(selectedItem).filter((key) => selectedItem[key]);
    const selectedItems = carts.filter((cart: any) => selectedCarts.includes(`${cart.id}-${cart.isPack !== undefined ? cart.isPack.toString() : "missing"}`));
    if (selectedItems.length > 0) {
      const queryString = selectedItems.map((item: any) => `items=${item.id}-${item.isPack}`).join("&");
      router.push(`/orders?${queryString}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-5">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border-2 border-[#a1a3b5] p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <Checkbox id="select-all" onChange={handleSelectAll} onCheckedChange={handleSelectAll} checked={selectAll} />

            <label className="text-xl font-semibold ml-3">Select All</label>
          </div>
          <Separator className="mb-4" />
          {carts.map((cart: any, index: any) => (
            <CartItem
              key={`${cart.id}-${cart.isPack !== undefined ? cart.isPack.toString() : "missing"}-${index + 1}`}
              cart={cart}
              isSelected={selectedItem[`${cart.id}-${cart.isPack !== undefined ? cart.isPack.toString() : "missing"}`] || false}
              onSelect={() => handleSelectedItem(cart.id, cart.isPack)}
            />
          ))}
        </div>
        <div className="grid grid-rows-2 max-md:grid-rows-1">
          <div className="bg-white rounded-xl border-2 border-[#a1a3b5] p-6 shadow-lg flex flex-col justify-between">
            <h1 className="text-xl font-semibold mb-4">Shopping Summary</h1>
            <Separator className="mb-4" />
            <div className="flex justify-between mb-2">
              <p className="text-gray-700">Subtotal</p>
              <p className="text-gray-700">{formatCurrency(subtotal)}</p>
            </div>
            <Separator className="mb-4" />
            <div className="flex justify-center">
              <Button variant="default" className="w-full" onClick={isCheckoutDisabled || !isServiceAvailable ? undefined : handleCheckout} disabled={isCheckoutDisabled || !isServiceAvailable}>
                Checkout
              </Button>
            </div>
            {(isCheckoutDisabled || !isServiceAvailable) && (
              <div className="mt-4 ">
                <Alert variant="default" className="text-destructive">
                  {!isServiceAvailable ? "Service is not available in your area." : "Please select at least one item to checkout."}
                </Alert>
              </div>
            )}
          </div>
          <div className="flex max-md:hidden max-md:overflow-y-hidden"></div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
