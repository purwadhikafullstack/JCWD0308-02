'use client';
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { Product } from '@/lib/types/product';

interface ProductCardProps {
  product: Product;
  onTitleClick: (slug: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onTitleClick }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const nextButton = carouselRef.current.querySelector('.carousel-next') as HTMLButtonElement;
        if (nextButton) {
          nextButton.click();
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
      <Carousel ref={carouselRef} className="relative w-full h-64" opts={{ loop: true }}>
        <CarouselContent className="flex">
          {product.images && product.images.length > 0 ? (
            product.images.map((image, index) => (
              <CarouselItem key={index} className="w-full h-64">
                <div className="relative w-full h-64">
                  <Image
                    src={image.imageUrl}
                    alt={`${product.title} image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                    priority={index === 0}
                  />
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
          <h3
            className="font-semibold text-base text-primary overflow-hidden overflow-ellipsis whitespace-normal line-clamp-3 cursor-pointer"
            onClick={() => onTitleClick(product.slug)}
          >
            {product.title}
          </h3>
        </div>
        <div className="h-12 mt-2 flex flex-col justify-center ml-4">
          <p className="text-xs font-semibold text-gray-500 line-through">
            Rp {product.price?.toLocaleString() ?? 'N/A'}
          </p>
          <p className="text-xl font-semibold text-primary">
            Rp {product.discountPrice?.toLocaleString() ?? 'N/A'}
          </p>
        </div>
      </div>
      <div className="mt-4 px-4">
        <button onClick={() => onTitleClick(product.slug)} className="w-full">
          <div className="bg-primary text-white text-center py-2 rounded-lg cursor-pointer hover:bg-primary-dark transition-colors hover:shadow-lg mb-2">
            Buy
          </div>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;