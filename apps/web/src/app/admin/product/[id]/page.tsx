"use client"
import React, { useEffect, useState } from 'react';
import { fetchProductById, updateProduct, deleteProduct } from '@/lib/fetch-api/product';
import EditForm from '../components/editform';
import { Product } from '../components/types';
import { Button } from '@/components/ui/button';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import Image from 'next/image';

const ProductDetail = () => {
  const id = window.location.pathname.split('/').pop();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const productData = await fetchProductById(id);
          setProduct(productData);
        } catch (error) {
          setError('Failed to fetch product');
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdate = async (updatedProduct: FormData) => {
    try {
      const product = await updateProduct(updatedProduct.get('id') as string, updatedProduct);
      setProduct(product);
      setEditingProduct(null);
      alert('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteProduct(id);
      alert('Product deleted successfully');
      window.location.href = '/admin/product';
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

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
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-600">{product.title}</h2>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <Carousel className="relative w-full h-64" opts={{ loop: true }}>
          <CarouselContent className="flex">
            {(product.images || []).map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full h-64">
                  <Image
                    src={`http://localhost:8000${image.imageUrl}`}
                    alt={`${product.title} image ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'contain' }}
                    className="rounded-t-lg"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-white bg-indigo-500 hover:bg-indigo-700 left-2" />
          <CarouselNext className="text-white bg-indigo-500 hover:bg-indigo-700 right-2" />
        </Carousel>
        <div className="p-6">
          <p className="text-md text-gray-600 mb-2"><strong>Slug:</strong> {product.slug}</p>
          <p className="text-md text-gray-600 mb-2"><strong>Description:</strong> {product.description}</p>
          <div className="flex justify-between items-center mb-2">
            <p className="text-lg font-semibold text-red-500 line-through">Rp {product.price.toLocaleString()}</p>
            <p className="text-lg font-semibold text-green-500">Rp {product.discountPrice?.toLocaleString() ?? 'N/A'}</p>
          </div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-lg font-semibold text-red-500 line-through">Rp {product.packPrice.toLocaleString()}</p>
            <p className="text-lg font-semibold text-green-500">Rp {product.discountPackPrice?.toLocaleString() ?? 'N/A'}</p>
          </div>
          <p className="text-md text-gray-600 mb-2"><strong>Pack Quantity:</strong> {product.packQuantity ?? 'N/A'} units</p>
          <p className="text-md text-gray-600 mb-2"><strong>Bonus:</strong> {product.bonus ?? 'No bonus'}</p>
          <p className="text-md text-gray-600 mb-2"><strong>Min Order:</strong> {product.minOrderItem ?? 'No min order'}</p>
          <p className="text-md text-gray-600 mb-2"><strong>Status:</strong> {product.status}</p>
          <p className="text-md text-gray-600 mb-2"><strong>Updated At:</strong> {new Date(product.updatedAt).toLocaleDateString()}</p>
          <p className="text-md text-gray-600 mb-2"><strong>Created At:</strong> {new Date(product.createdAt).toLocaleDateString()}</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={() => handleEdit(product)} className="bg-blue-500 text-white p-2 rounded-lg shadow-md hover:bg-blue-600 transition-all">
              <FaEdit />
            </Button>
            <Button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded-lg shadow-md hover:bg-red-600 transition-all">
              <FaTrashAlt />
            </Button>
          </div>
        </div>
      </div>
      {editingProduct && (
        <EditForm product={editingProduct} onUpdate={handleUpdate} onCancel={() => setEditingProduct(null)} />
      )}
    </div>
  );
};

export default ProductDetail;
