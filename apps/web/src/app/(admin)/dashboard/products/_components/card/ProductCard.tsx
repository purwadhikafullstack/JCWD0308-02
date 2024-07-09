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
  onTitleClick: (id: string) => void;
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
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 border-2 border-primary">
      <Carousel ref={carouselRef} className="relative w-full h-80" opts={{ loop: true }}>
        <CarouselContent className="flex">
          {product.images.length > 0 ? (
            product.images.map((image, index) => (
              <CarouselItem key={index} className="w-full h-80">
                <div className="relative w-full h-full">
                  <Image
                    src={image.imageUrl}
                    alt={`${product.title} image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg border-b-2 border-primary"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))
          ) : (
            <CarouselItem className="w-full h-80">
              <div className="relative w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">No Image Available</span>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious className="carousel-previous absolute left-0 top-1/2 hidden" />
        <CarouselNext className="carousel-next absolute right-0 top-1/2 hidden" />
      </Carousel>
      <div className="p-6">
        <p
          className="text-lg font-bold text-center mb-2 text-gray-800 hover:text-primary cursor-pointer line-clamp-3 min-h-[3rem]"
          onClick={() => onTitleClick(product.id)}
        >
          {product.title}
        </p>
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-lg font-semibold text-red-500 line-through">Rp {product.price?.toLocaleString() ?? 'N/A'}</p>
            <p className="text-lg font-semibold text-green-500">Rp {product.discountPrice?.toLocaleString() ?? 'N/A'}</p>
          </div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-semibold text-red-500 line-through">Rp {product.packPrice?.toLocaleString() ?? 'N/A'}</p>
            <p className="text-lg font-semibold text-green-500">Rp {product.discountPackPrice?.toLocaleString() ?? 'N/A'}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <p className="text-sm text-gray-600"><strong>Pack Quantity:</strong> {product.packQuantity ?? 'N/A'} units</p>
            <p className="text-sm text-gray-600"><strong>Bonus:</strong> {product.bonus ?? 'No bonus'}</p>
            <p className="text-sm text-gray-600"><strong>Min Order:</strong> {product.minOrderItem ?? 'No min order'}</p>
            <p className="text-sm text-gray-600"><strong>Status:</strong> {product.status}</p>
            <p className="text-sm text-gray-600"><strong>Updated At:</strong> {new Date(product.updatedAt).toLocaleDateString()}</p>
            <p className="text-sm text-gray-600"><strong>Created At:</strong> {new Date(product.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
