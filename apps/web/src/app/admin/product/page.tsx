"use client"
import React, { useEffect, useState } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '@/lib/fetch-api/product';
import EditForm from './components/editform';
import CreateForm from './components/createform';
import { Product } from '../product/components/types';
import { Button } from '@/components/ui/button';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [creatingProduct, setCreatingProduct] = useState<boolean>(false);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchProducts();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, []);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCreate = async (newProduct: FormData) => {
    try {
      const createdProduct = await createProduct(newProduct);
      alert('Product created successfully');
      setProducts([createdProduct, ...products]);
      setCreatingProduct(false);
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product');
    }
  };

  const handleUpdate = async (updatedProduct: FormData) => {
    try {
      const product = await updateProduct(updatedProduct.get('id') as string, updatedProduct);
      setProducts(products.map(p => (p.id === product.id ? product : p)));
      setSelectedProduct(null);
      alert('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      alert('Product deleted successfully');
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleTitleClick = (id: string) => {
    window.location.href = `/admin/product/${id}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-600">Products</h2>
      <p className="text-lg mb-8 text-center text-gray-700">Manage your products here.</p>
      <div className="mb-6 text-center">
        <Button onClick={() => setCreatingProduct(true)} className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:from-green-500 hover:to-blue-600 transition-all">
          Create Product
        </Button>
      </div>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
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
                            style={{ objectFit: 'cover' }}
                            className="rounded-t-lg"
                            priority={index === 0}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="text-white bg-indigo-500 hover:bg-indigo-700" />
                  <CarouselNext className="text-white bg-indigo-500 hover:bg-indigo-700" />
                </Carousel>
                <div className="p-6">
                  <p
                    className="text-2xl font-bold text-center mb-2 text-gray-800 hover:underline hover:text-blue-600 cursor-pointer"
                    onClick={() => handleTitleClick(product.id)}
                  >
                    {product.title}
                  </p>
                  <p className="text-md text-gray-600 text-center mb-4">{product.slug}</p>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-lg font-semibold text-red-500 line-through">Rp {product.price.toLocaleString()}</p>
                    <p className="text-lg font-semibold text-green-500">Rp {product.discountPrice?.toLocaleString() ?? 'N/A'}</p>
                  </div>
                  <div className="flex justify-between items-center mb-4">
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
                    <Button onClick={() => handleDelete(product.id)} className="bg-red-500 text-white p-2 rounded-lg shadow-md hover:bg-red-600 transition-all">
                      <FaTrashAlt />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {selectedProduct && (
            <EditForm product={selectedProduct} onUpdate={handleUpdate} onCancel={() => setSelectedProduct(null)} />
          )}
          {creatingProduct && (
            <CreateForm onCreate={handleCreate} onCancel={() => setCreatingProduct(false)} />
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
