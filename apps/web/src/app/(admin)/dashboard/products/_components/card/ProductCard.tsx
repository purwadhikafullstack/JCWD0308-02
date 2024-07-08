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
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
      <Carousel ref={carouselRef} className="relative w-full h-64" opts={{ loop: true }}>
        <CarouselContent className="flex">
          {product.images.length > 0 ? (
            product.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full h-64">
                  <Image
                    src={image.imageUrl}
                    alt={`${product.title} image ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    className="rounded-t-lg"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))
          ) : (
            <CarouselItem>
              <div className="relative w-full h-64 flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">No Image Available</span>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious className="carousel-previous absolute left-0 top-1/2 transform -translate-y-1/2 bg-primary text-secondary p-2 rounded-full hover:bg-primary-100 cursor-pointer" />
        <CarouselNext className="carousel-next absolute right-0 top-1/2 transform -translate-y-1/2 bg-primary text-secondary p-2 rounded-full hover:bg-primary-100 cursor-pointer" />
      </Carousel>
      <div className="p-6">
        <p
          className="text-2xl font-bold text-center mb-2 text-gray-800 hover:underline hover:text-primary cursor-pointer"
          onClick={() => onTitleClick(product.id)}
        >
          {product.title}
        </p>
        <p className="text-md text-gray-600 text-center mb-4">{product.slug}</p>
        <div className="flex justify-between items-center mb-2">
          <p className="text-lg font-semibold text-red-500 line-through">Rp {product.price?.toLocaleString() ?? 'N/A'}</p>
          <p className="text-lg font-semibold text-green-500">Rp {product.discountPrice?.toLocaleString() ?? 'N/A'}</p>
        </div>
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold text-red-500 line-through">Rp {product.packPrice?.toLocaleString() ?? 'N/A'}</p>
          <p className="text-lg font-semibold text-green-500">Rp {product.discountPackPrice?.toLocaleString() ?? 'N/A'}</p>
        </div>
        <p className="text-md text-gray-600 mb-2"><strong>Pack Quantity:</strong> {product.packQuantity ?? 'N/A'} units</p>
        <p className="text-md text-gray-600 mb-2"><strong>Bonus:</strong> {product.bonus ?? 'No bonus'}</p>
        <p className="text-md text-gray-600 mb-2"><strong>Min Order:</strong> {product.minOrderItem ?? 'No min order'}</p>
        <p className="text-md text-gray-600 mb-2"><strong>Status:</strong> {product.status}</p>
        <p className="text-md text-gray-600 mb-2"><strong>Updated At:</strong> {new Date(product.updatedAt).toLocaleDateString()}</p>
        <p className="text-md text-gray-600 mb-2"><strong>Created At:</strong> {new Date(product.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default ProductCard;
