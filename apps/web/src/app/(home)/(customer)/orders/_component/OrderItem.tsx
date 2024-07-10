import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CartItemType } from "@/lib/types/cart";

interface CartItemProps {
  cart: CartItemType;
}
const OrderItem: React.FC<CartItemProps> = ({ cart }) => {
  return (
    <div className="bg-card text-card-foreground border-2 shadow-lg rounded-lg p-4">
      <div className="flex items-center">
        <h2 className="font-semibold">{cart.stock.product.title}</h2>
      </div>
      <div className="flex items-center justify-between p-4 gap-4">
        <p>Type: {cart.isPack ? "Grosir" : "Eceran"}</p>
        <p>Price: {cart.isPack ? cart.stock.product.packPrice : cart.stock.product.price}</p>
      </div>
      <div className="flex gap-2 justify-end p-4">
        <span className="text-lg">Quantity: {cart.quantity}</span>
      </div>
    </div>
  );
};

export default OrderItem;
