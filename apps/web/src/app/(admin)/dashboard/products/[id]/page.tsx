"use client";
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Image from 'next/image';
import { Product } from '@/lib/types/product';
import { fetchProductById, updateProduct } from '@/lib/fetch-api/product';
import EditProductForm from '../_components/forms/EditProductForm';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { handleApiError, showSuccess, showError } from '@/components/toast/toastutils';
import DeleteProductDialog from '../_components/dialogs/DeleteProductDialog';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/lib/fetch-api/user/client';

const ProductDetail = () => {
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split('/').pop();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const fetchProduct = useCallback(async () => {
    if (id) {
      try {
        setLoading(true);
        const productData = await fetchProductById(id);
        setProduct(productData);
      } catch (error) {
        setError('Failed to fetch product');
        showError('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

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

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdate = async (updatedProduct: FormData) => {
    try {
      await updateProduct(id as string, updatedProduct);
      showSuccess('Product updated successfully');
      setEditingProduct(null);
      fetchProduct();
    } catch (error) {
      console.error('Error updating product:', error);
      handleApiError(error, 'Failed to update product');
    }
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteSuccess = () => {
    router.push('/dashboard/products');
  };

  // Fetch user profile to determine role
  const userProfile = useSuspenseQuery({
    queryKey: ['user-profile'],
    queryFn: getUserProfile,
  });

  const isStoreAdmin = userProfile.data?.user?.role === 'STORE_ADMIN';

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!product) {
    return <p>No product found</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-primary">{product.title}</h2>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <Carousel ref={carouselRef} className="max-w-xs mx-auto">
          <CarouselContent className="flex">
            {product.images.length > 0 ? (
              product.images.map((image, index) => (
                <CarouselItem key={index} className="w-[240px] h-[240px]">
                  <div className="relative w-full h-full">
                    <Image
                      src={image.imageUrl}
                      alt={`${product.title} image ${index + 1}`}
                      width={240}
                      height={240}
                      className="rounded-t-lg border-b-2 border-primary"
                      priority={index === 0}
                    />
                  </div>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem className="w-[240px] h-[240px]">
                <div className="relative w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious className="carousel-previous absolute left-0 top-1/2 transform -translate-y-1/2 bg-primary text-white p-2 rounded-full hover:bg-primary-100 cursor-pointer" />
          <CarouselNext className="carousel-next absolute right-0 top-1/2 transform -translate-y-1/2 bg-primary text-white p-2 rounded-full hover:bg-primary-100 cursor-pointer" />
        </Carousel>
        <div className="p-6">
          <p className="text-md text-gray-600 mb-2"><strong>Description:</strong> {product.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-lg font-semibold text-red-500 line-through">Rp {product.price?.toLocaleString() ?? 'N/A'}</p>
              <p className="text-lg font-semibold text-green-500">Rp {product.discountPrice?.toLocaleString() ?? 'N/A'}</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-red-500 line-through">Rp {product.packPrice?.toLocaleString() ?? 'N/A'}</p>
              <p className="text-lg font-semibold text-green-500">Rp {product.discountPackPrice?.toLocaleString() ?? 'N/A'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <p className="text-sm text-gray-600"><strong>Pack Quantity:</strong> {product.packQuantity ?? 'N/A'} units</p>
            <p className="text-sm text-gray-600"><strong>Bonus:</strong> {product.bonus ?? 'No bonus'}</p>
            <p className="text-sm text-gray-600"><strong>Min Order:</strong> {product.minOrderItem ?? 'No min order'}</p>
            <p className="text-sm text-gray-600"><strong>Status:</strong> {product.status}</p>
            <p className="text-sm text-gray-600"><strong>Updated At:</strong> {new Date(product.updatedAt).toLocaleDateString()}</p>
            <p className="text-sm text-gray-600"><strong>Created At:</strong> {new Date(product.createdAt).toLocaleDateString()}</p>
          </div>
          {!isStoreAdmin && (
            <div className="flex justify-end space-x-2 mt-4">
              <Button onClick={() => handleEdit(product)} className="bg-blue-500 text-white p-2 rounded-lg shadow-md hover:bg-blue-600 transition-all"><FaEdit /></Button>
              <Button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded-lg shadow-md hover:bg-red-600 transition-all"><FaTrashAlt /></Button>
            </div>
          )}
        </div>
      </div>
      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onUpdate={handleUpdate}
          onCancel={() => setEditingProduct(null)}
        />
      )}
      {showDeleteDialog && (
        <DeleteProductDialog
          product={product}
          onClose={() => setShowDeleteDialog(false)}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default ProductDetail;
