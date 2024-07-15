'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/features/hooks';
import { addCartItem, addToCart, fetchCart, fetchCartItemCount } from '@/lib/features/cart/cartSlice';
import { fetchProductBySlug } from '@/lib/fetch-api/product';
import { Product } from '@/lib/types/product';
import { formatCurrency } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus, Box } from 'lucide-react';
import Image from 'next/image';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getNearestStocks } from '@/lib/fetch-api/stocks/client';
import { getSelectedAddress } from '@/lib/fetch-api/address/client';
import { getUserProfile } from '@/lib/fetch-api/user/client';
import { toast } from '@/components/ui/sonner';
import ImageHover from './components/ImageHover';
import { RootState } from '@/lib/features/store';

const ProductDetail = () => {
  const params = useParams();
  const productSlug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isPack, setIsPack] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const cartItems = useAppSelector((state: RootState) => state.cart.items);

  const nearestStocks = useSuspenseQuery({
    queryKey: ['nearest-stocks', 1, 15, ''],
    queryFn: async () => {
      const filters = Object.fromEntries(new URLSearchParams(String('')));
      return getNearestStocks(1, 15, filters);
    },
  });

  const selectedAddress = useSuspenseQuery({
    queryKey: ['selected-address'],
    queryFn: getSelectedAddress,
  });

  const userProfile = useSuspenseQuery({
    queryKey: ['user-profile'],
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
        console.error('Error fetching product:', error);
        setError('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    dispatch(fetchCart());
  }, [productSlug, dispatch]);

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };
  const nearestStock = useMemo(() => {
    if (!product) return nearestStocks.data?.stocks?.[0];
    return nearestStocks.data?.stocks?.find((stock) => stock.productId === product.id) || nearestStocks.data?.stocks?.[0];
  }, [product, nearestStocks.data?.stocks]);

  const totalQuantityInCart = useMemo(() => {
    if (!product) return 0;
    const productInCart = cartItems.find((item: any) => item.stock?.productId === product.id);

    return productInCart ? productInCart.quantity : 0;
  }, [product, cartItems]);

  const totalQuantity = useMemo(() => {
    if (!product) return 0;
    if (!isPack) return quantity;
    return quantity * product?.packQuantity!;
  }, [product, isPack, quantity]);

  const isMaxQuantity = useMemo(() => {
    if (!isPack) return quantity === nearestStock.amount;
    return totalQuantity + product?.packQuantity! >= nearestStock.amount;
  }, [isPack, nearestStock.amount, product?.packQuantity, quantity, totalQuantity]);

  const isAddToCartDisabled = useMemo(() => {
    if (!product || !nearestStock) return true;
    const availableStock = nearestStock.amount || 0;
    const maxQuantityAllowed = isPack ? availableStock / product.packQuantity! : availableStock;
    return quantity + totalQuantityInCart > maxQuantityAllowed || totalQuantity > availableStock;
  }, [product, nearestStock, quantity, totalQuantityInCart, totalQuantity, isPack]);

  const handleAddToCart = async () => {
    try {
      const availableStock = nearestStock?.amount || 0;

      let selectedQuantity = quantity;
      if (isPack) {
        selectedQuantity = +product?.packQuantity!;
      }

      if (selectedQuantity > availableStock) {
        toast.error('Quantity exceeds available stock.');
        return;
      }
      await dispatch(addCartItem({ stockId: nearestStock?.id!, quantity, isPack }));
      toast.success('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error adding to cart');
    }
    dispatch(fetchCartItemCount());
  };

  const handleQuantityChange = (type: 'increment' | 'decrement') => {
    setQuantity((prevQuantity) => (type === 'increment' ? prevQuantity + 1 : Math.max(1, prevQuantity - 1)));
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="loader"></span>
      </div>
    );
  }
  if (error) return <p>{error}</p>;

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
                <div key={index} className={`cursor-pointer p-1 border-2 ${currentImageIndex === index ? 'border-blue-600' : 'border-transparent'} rounded-lg`} onClick={() => handleThumbnailClick(index)}>
                  <Image src={image.imageUrl} alt={product.title} width={80} height={80} className="object-cover rounded-lg hover:border-blue-600 transition" />
                </div>
              ))}
            </div>
            <div className="w-full flex justify-center items-center overflow-hidden">
              {product.images[currentImageIndex] && (
                <div className="relative w-full h-96">
                  <ImageHover alt={product.slug} src={product.images[currentImageIndex].imageUrl} width={650} height={650} />
                </div>
              )}
            </div>
          </div>
          <div className="w-full md:w-1/2 md:pl-8 p-4">
            <h1 className="text-4xl font-bold mb-2 text-primary">{product.title}</h1>
            <p className="text-lg mb-4 text-gray-600">{product.description}</p>
            <div className="flex space-x-4 mb-4">
              <Button
                variant={!isPack ? 'default' : 'outline'}
                onClick={() => {
                  setIsPack(false);
                  setQuantity(quantity * product?.packQuantity!);
                }}
                className={`flex-1 ${!isPack ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Unit Price
              </Button>
              <Button
                variant={isPack ? 'default' : 'outline'}
                onClick={() => {
                  setIsPack(true);
                  setQuantity(Math.ceil(quantity / product?.packQuantity!));
                }}
                className={`flex-1 ${isPack ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
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
            {isPack && <p className="text-sm mb-4 text-gray-600">Pack Quantity: {product.packQuantity}</p>}
            {nearestStock && <p className="text-sm mb-4 text-gray-600">Available Stock: {nearestStock.amount}</p>}

            <div className="flex items-center space-x-4 mb-4">
              <Button variant="outline" onClick={() => handleQuantityChange('decrement')} disabled={quantity === 1}>
                <Minus size={18} />
              </Button>
              <p className="text-lg">{quantity}</p>
              <Button variant="outline" onClick={() => handleQuantityChange('increment')} disabled={isMaxQuantity}>
                <Plus size={18} />
              </Button>
            </div>
            {isPack && <p className="text-lg">Total Quantity: {quantity * (product?.packQuantity || 1)}</p>}

            <div className="flex space-x-4">
              <Button variant="default" onClick={handleAddToCart} className="w-full bg-primary" disabled={!isServiceAvailable || isAddToCartDisabled}>
                <ShoppingCart size={20} className="mr-2" />
                {nearestStock?.amount === 0 ? 'Out of Stock' : 'Add to Cart'}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
