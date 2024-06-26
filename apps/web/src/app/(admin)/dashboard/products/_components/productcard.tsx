'use client';
import React from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
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
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onTitleClick: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete, onTitleClick }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
      <Carousel className="relative w-full h-64">
        <CarouselContent className="flex">
          {(product.images || []).map((image, index) => (
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
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-700 cursor-pointer" />
        <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-700 cursor-pointer" />
      </Carousel>
      <div className="p-6">
        <p
          className="text-2xl font-bold text-center mb-2 text-gray-800 hover:underline hover:text-blue-600 cursor-pointer"
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
        <div className="flex justify-end space-x-2 mt-4">
          <Button onClick={() => onEdit(product)} className="bg-blue-500 text-white p-2 rounded-lg shadow-md hover:bg-blue-600 transition-all">
            <FaEdit />
          </Button>
          <Button onClick={() => onDelete(product.id)} className="bg-red-500 text-white p-2 rounded-lg shadow-md hover:bg-red-600 transition-all">
            <FaTrashAlt />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
