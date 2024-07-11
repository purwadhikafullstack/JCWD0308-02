"use client";
import React, { useEffect, useRef } from "react";
import { getSelectedAddress } from "@/lib/fetch-api/address/client";
import { getNearestStocks } from "@/lib/fetch-api/stocks/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { NearestStock } from "@/lib/types/stock";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { getUserProfile } from "@/lib/fetch-api/user/client";

interface ProductItemProps {
  stock: NearestStock;
  addressId: string | undefined;
}

const ProductItem: React.FC<ProductItemProps> = ({ stock, addressId }) => {
  const userProfile = useSuspenseQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
  });
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const nextButton = carouselRef.current.querySelector(".carousel-next") as HTMLButtonElement;
        if (nextButton) {
          nextButton.click();
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const product = stock.product;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
      <Carousel
        ref={carouselRef}
        className="relative w-full h-64"
        opts={{ loop: true }}
      >
        <CarouselContent className="flex">
          {product.images && product.images.length > 0 ? (
            product.images.map((image, index) => (
              <CarouselItem key={index} className="w-full h-64">
                <div className="relative w-full h-64">
                  <Image src={image.imageUrl} alt={`${product.title} image ${index + 1}`} layout="fill" objectFit="cover" className="rounded-t-lg" priority={index === 0} />
                </div>
              </CarouselItem>
            ))
          ) : (
            <CarouselItem className="w-full h-64">
              <div className="relative w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">No Image Available</span>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious className="carousel-previous absolute left-0 top-1/2 hidden" />
        <CarouselNext className="carousel-next absolute right-0 top-1/2 hidden" />
      </Carousel>
      <div className="relative z-20 mt-2">
        <div className="h-20 flex items-center justify-center text-center">
          <Link
            href={`/products/detail/${product.slug}`}
            className="font-semibold text-base text-primary overflow-hidden overflow-ellipsis whitespace-normal line-clamp-3 cursor-pointer"
          >{product.title}</Link>
        </div>
        <div className="h-12 mt-2 flex flex-col justify-center ml-4">
          <p className="text-xs font-semibold text-gray-500 line-through" suppressHydrationWarning>Rp {product.price?.toLocaleString() ?? "N/A"}</p>
          <p className="text-xl font-semibold text-primary" suppressHydrationWarning>Rp {product.discountPrice?.toLocaleString() ?? "N/A"}</p>
        </div>
      </div>
      <div className="mt-4">

        {stock.amount > 0 ? (
          <Link href={`/products/detail/${product.slug}`}>
            <div className="bg-primary text-white text-center py-2 w-full rounded-lg cursor-pointer hover:bg-primary-dark transition-colors hover:shadow-lg">
              Buy
            </div>
          </Link>
        ) : (
          <div className="bg-gray-500 text-white text-center py-2 w-full rounded-lg cursor-not-allowed text-base">
            Product Out of Stock 
          </div>
        )}

      </div>
    </div>
  );
};

export default function FeaturedProducts() {
  const nearestStocks = useSuspenseQuery({
    queryKey: ['nearest-stocks', 1, 15, ''],
    queryFn: async ({ queryKey }) => {
      const filters = Object.fromEntries(new URLSearchParams(String("")));
      return getNearestStocks(Number(1), Number(15), filters);
    }
  });

  const selectedAddress = useSuspenseQuery({
    queryKey: ["selected-address"],
    queryFn: getSelectedAddress,
  });

  if (!nearestStocks.data?.stocks?.length)
    return (
      <div className="h-full w-full flex items-center justify-center">
        <h1>Sorry, we are out of stock! :(</h1>
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
            href="/products"
            className="text-sm font-medium text-primary hover:underline underline-offset-4"
            prefetch={false}
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-6">
          {nearestStocks.data.stocks.map(
            (stock: NearestStock, index: number) => (
              <ProductItem key={index} stock={stock} addressId={addressId} />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
