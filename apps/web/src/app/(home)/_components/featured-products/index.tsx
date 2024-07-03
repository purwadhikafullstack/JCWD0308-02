'use client';

import { Button } from '@/components/ui/button';
import { getNearestStocks } from '@/lib/fetch-api/stocks/client';
import { cn } from '@/lib/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';

export default function FeaturedProducts() {
  const nearestStocks = useSuspenseQuery({
    queryKey: ['nearest-stocks'],
    queryFn: getNearestStocks,
  });

  if (!nearestStocks.data?.stocks?.length)
    return (
      <div className="h-full w-full flex items-center justify-center">
        <h1>sorry we are out of stock! :(</h1>
      </div>
    );

  return (
    <section className="w-full py-6 sm:py-10 md:py-12 lg:py-14">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between">
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
            <div key={stock?.id} className={cn('grid gap-2.5 relative group')}>
              <Link
                href={`/product/${stock.product.slug}`}
                className="absolute inset-0 z-10"
                prefetch={false}
              >
                <span className="sr-only">View</span>
              </Link>
              <Image
                src={stock?.product?.images[0]?.imageUrl || '/placeholder.svg'}
                alt="Apples"
                width={200}
                height={200}
                className="rounded-lg object-cover w-full aspect-square group-hover:opacity-50 transition-opacity"
              />
              <div className="grid gap-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold max-w-36 truncate">
                    {stock?.product?.title}
                  </h3>
                  {/* <h4 className="font-semibold">$2.99/lb</h4> */}
                </div>
                <Button variant="outline" className="w-full">
                  View Product
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
