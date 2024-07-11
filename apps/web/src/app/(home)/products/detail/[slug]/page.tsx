"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/features/hooks";
import { addCartItem, addToCart } from "@/lib/features/cart/cartSlice";
import { fetchProductBySlug } from "@/lib/fetch-api/product";
import { Product } from "@/lib/types/product";
import { formatCurrency } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, CheckCircle, Gift, Box } from "lucide-react";
import Image from "next/image";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getNearestStocks } from "@/lib/fetch-api/stocks/client";
import { getSelectedAddress } from "@/lib/fetch-api/address/client";
import { getUserProfile } from "@/lib/fetch-api/user/client";
import { toast } from "@/components/ui/sonner";

const ProductDetail = () => {
  const { slug } = useParams();
  const productSlug = Array.isArray(slug) ? slug[0] : slug; // Ensure slug is a string
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isPack, setIsPack] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const nearestStocks = useSuspenseQuery({
    queryKey: ["nearest-stocks", 1, 15, ""],
    queryFn: async () => {
      const filters = Object.fromEntries(new URLSearchParams(String("")));
      return getNearestStocks(1, 15, filters);
    },
  });

  const selectedAddress = useSuspenseQuery({
    queryKey: ["selected-address"],
    queryFn: getSelectedAddress,
  });

  const userProfile = useSuspenseQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
  });

  const isError = !userProfile.data?.user;
  const isServiceAvailable = nearestStocks.data?.isServiceAvailable ?? false;
  const addressId = selectedAddress.data?.address?.id;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedProduct = await fetchProductBySlug(productSlug);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productSlug]);

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleAddToCart = () => {
    if (!product) return;

    try {
      const cartRequest: any = {
        productId: product.id,
        quantity,
        isPack,
        addressId,
        stockId: product.stock?.[0]?.id ?? "",
        isChecked: false,
      };
      const availableStock = product?.stock?.reduce((total, stock) => total + stock.amount, 0) || 0;
      if (quantity > availableStock) {
        toast.error("Quantity exceeds available stock.");
        return;
      }
      dispatch(addCartItem(cartRequest))
        .unwrap()
        .then((response) => {
          dispatch(addToCart(response));
          toast.success("Product added to cart!");
        })
        .catch((error) => {
          console.error("Error adding product to cart:", error);
          toast.error("Failed to add product to cart.");
        });
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleQuantityChange = (type: "increment" | "decrement") => {
    setQuantity((prevQuantity) => (type === "increment" ? prevQuantity + 1 : Math.max(1, prevQuantity - 1)));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const availableStock = product?.stock?.reduce((total, stock) => total + stock.amount, 0) || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={() => router.back()} className="mb-4">
        Back
      </Button>
      {product && (
        <div className="flex flex-col md:flex-row items-start md:items-center bg-white shadow-md rounded-lg overflow-hidden">
          <div className="w-full md:w-1/2 relative p-4 flex">
            <div className="flex flex-col space-y-2 mr-4">
              {product.images.map((image, index) => (
                <div key={index} className={`cursor-pointer p-1 border-2 ${currentImageIndex === index ? "border-blue-600" : "border-transparent"} rounded-lg`} onClick={() => handleThumbnailClick(index)}>
                  <Image src={image.imageUrl} alt={product.title} width={80} height={80} className="object-cover rounded-lg hover:border-blue-600 transition" />
                </div>
              ))}
            </div>
            <div className="w-full flex justify-center items-center">
              {product.images[currentImageIndex] && (
                <div className="relative w-full h-96">
                  <Image src={product.images[currentImageIndex].imageUrl} alt={product.title} layout="fill" objectFit="contain" className="rounded-lg border-2 border-gray-200 shadow-sm" />
                </div>
              )}
            </div>
          </div>
          <div className="w-full md:w-1/2 md:pl-8 p-4">
            <h1 className="text-4xl font-bold mb-2 text-primary">{product.title}</h1>
            <p className="text-lg mb-4 text-gray-600">{product.description}</p>
            <div className="flex space-x-4 mb-4">
              <Button variant={!isPack ? "default" : "outline"} onClick={() => setIsPack(false)} className={`flex-1 ${!isPack ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}>
                Unit Price
              </Button>
              <Button variant={isPack ? "default" : "outline"} onClick={() => setIsPack(true)} className={`flex-1 ${isPack ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}>
                Pack Price
              </Button>
            </div>
            {isPack ? (
              <p className="text-2xl font-bold mb-4 text-primary">
                <del className="text-xs font-semibold text-gray-500 line-through">{formatCurrency(product.packPrice || 0)}</del> {formatCurrency(product.discountPackPrice || product.packPrice || 0)}
              </p>
            ) : (
              <p className="text-2xl font-bold mb-4 text-primary">
                <del className="text-xs font-semibold text-gray-500 line-through">{formatCurrency(product.price || 0)}</del> {formatCurrency(product.discountPrice || product.price || 0)}
              </p>
            )}
            <p className="text-sm mb-4 text-gray-600">Available Stock: {availableStock}</p>
            <div className="flex items-center space-x-4 mb-4">
              <Button variant="outline" onClick={() => handleQuantityChange("decrement")} disabled={quantity <= 1}>
                <Minus size={16} />
              </Button>
              <p className="text-lg">{quantity}</p>
              <Button variant="outline" onClick={() => handleQuantityChange("increment")}>
                <Plus size={16} />
              </Button>
            </div>
            <div className="flex space-x-4">
              <Button variant="default" onClick={handleAddToCart} disabled={availableStock === 0 || !isServiceAvailable} className="bg-blue-600 text-white hover:bg-blue-700">
                <ShoppingCart size={20} className="mr-2" />
                {availableStock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>
            {isError ? (
              <div className="mt-4 text-destructive">
                <p>Login First</p>
              </div>
            ) : !isServiceAvailable ? (
              <div className="mt-4 text-destructive">
                <p>Service is not available in this area.</p>
              </div>
            ) : null}
            <div className="mt-6 space-y-2">
              {product.weight !== undefined && (
                <div className="flex items-center text-gray-600">
                  <Box size={16} className="mr-2" />
                  <span>Weight: {product.weight} g</span>
                </div>
              )}
              {product.weightPack !== undefined && (
                <div className="flex items-center text-gray-600">
                  <Box size={16} className="mr-2" />
                  <span>Weight Pack: {product.weightPack} g</span>
                </div>
              )}
              {product.stock && product.stock.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mt-4 mb-2 text-gray-700">Stock Information:</h2>
                  {product.stock.map((stock) => (
                    <div key={stock.id} className=" text-gray-600">
                      <div className="flex items-center text-bold text-primary">
                        <Box size={16} className="mr-2" />
                        <span> {stock.store.name}</span>
                      </div>
                      <div className="flex items-center ml-6 mt-1 text-sm">
                        <CheckCircle size={16} className="mr-2" />
                        <span>Store Stock: {stock.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
