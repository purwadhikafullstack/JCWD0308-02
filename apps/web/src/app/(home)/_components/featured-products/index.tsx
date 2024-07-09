'use client';
import { Button } from '@/components/ui/button';
import { addCartItem, addToCart } from '@/lib/features/cart/cartSlice';
import { useAppDispatch } from '@/lib/features/hooks';
import { getSelectedAddress } from '@/lib/fetch-api/address/client';
import { getNearestStocks } from '@/lib/fetch-api/stocks/client';
import { CartRequestType } from '@/lib/types/cart';
import { cn } from '@/lib/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from '../AddToCartButton';

export default function FeaturedProducts() {
  const dispatch = useAppDispatch();
  const nearestStocks = useSuspenseQuery({
    queryKey: ['nearest-stocks'],
    queryFn: getNearestStocks,
  });
  const selectedAddress = useSuspenseQuery({
    queryKey: ['selected-address'],
    queryFn: getSelectedAddress,
  });

  if (!nearestStocks.data?.stocks?.length)
    return (
      <div className="h-full w-full flex items-center justify-center">
        <h1>sorry we are out of stock! :(</h1>
      </div>
    );

  const addressId = selectedAddress.data?.address?.id;

  return (
    <section className="w-full py-6 sm:py-10 md:py-12 lg:py-14">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl">
            Featured Products
          </h2>
          <Link
            href="#"
            className="text-sm font-medium text-primary hover:underline underline-offset-4"
            prefetch={false}
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-6">
          {nearestStocks?.data?.stocks?.map((stock, index) => (
            <div
              key={`${stock?.id}-${index + 1}`}
              className={cn(
                'bg-white p-4 rounded-lg shadow-md group relative hover:shadow-lg transition-shadow',
              )}
            >
              <Link
                href={`/product/${stock.product.slug}`}
                className="absolute inset-0"
                prefetch={false}
              >
                <span className="sr-only">View</span>
              </Link>
              <Image
                src={stock?.product?.images[0]?.imageUrl || '/placeholder.svg'}
                alt={stock?.product?.title || 'Product Image'}
                width={200}
                height={200}
                className="rounded-lg object-cover w-full aspect-square group-hover:opacity-80 transition-opacity"
              />
              <div className="grid gap-2 relative mt-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-primary max-w-36 truncate">
                    {stock?.product?.title}
                  </h3>
                </div>
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    className="text-primary border-primary w-full sm:w-auto"
                  >
                    <Link href={`/product/${stock.product.slug}`}>View</Link>
                  </Button>
                  <AddToCartButton
                    productId={stock?.product?.id}
                    isPack={false}
                    addressId={addressId}
                    stockId={stock?.id}
                    key={`${stock?.id}-${stock?.product?.isPack}-${index + 1}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
