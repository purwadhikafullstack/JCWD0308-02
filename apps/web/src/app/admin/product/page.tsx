"use client"
import React, { useEffect, useState } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '@/lib/fetch-api/product';
import { fetchCategories } from '@/lib/fetch-api/category';
import EditForm from './components/editform';
import CreateForm from './components/createform';
import { Product } from './components/types';
import { Button } from '@/components/ui/button';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Category } from '@/app/admin/categories/components/types';

const PaginationButton = ({ disabled, onClick, children }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`gap-1 px-4 py-2 rounded-md ${disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-500 text-white hover:bg-indigo-600 transition-all'}`}
  >
    {children}
  </button>
);

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [creatingProduct, setCreatingProduct] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [limit, setLimit] = useState<number>(8);
  const [filters, setFilters] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [productData, categoryData] = await Promise.all([fetchProducts(page, limit, filters), fetchCategories()]);
        setProducts(productData.products);
        setTotal(productData.total);
        setCategories([{ id: 'all', name: 'All Categories', superAdminId: '' }, ...categoryData]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limit, filters]);

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

  useEffect(() => {
    if (creatingProduct === false) {
      const fetchUpdatedProducts = async () => {
        try {
          const productData = await fetchProducts(page, limit, filters);
          setProducts(productData.products);
          setTotal(productData.total);
        } catch (error) {
          console.error('Error fetching updated products:', error);
          setError('Failed to fetch updated products');
        }
      };

      fetchUpdatedProducts();
    }
  }, [creatingProduct]);

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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleCategoryFilterChange = (categoryId: string) => {
    if (categoryId === 'all') {
      setFilters({});
    } else {
      setFilters({ ...filters, categoryId });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-600">Products</h2>
      <p className="text-lg mb-8 text-center text-gray-700">Manage your products here.</p>
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => setCreatingProduct(true)} className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:from-green-500 hover:to-blue-600 transition-all">
          Create Product
        </Button>
        <div className="w-1/4">
          <Select onValueChange={handleCategoryFilterChange}>
            <SelectTrigger aria-label="Category Filter">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
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
                    onClick={() => handleTitleClick(product.id)}
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
          <Pagination className="mt-6">
            <PaginationButton onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </PaginationButton>
            <PaginationContent>
              {/* {[...Array(Math.ceil(total / limit)).keys()].map((pageIndex) => (
                <PaginationItem key={pageIndex}>
                  <PaginationLink
                    href="#"
                    isActive={pageIndex + 1 === page}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pageIndex + 1);
                    }}
                  >
                    {pageIndex + 1}
                  </PaginationLink>
                </PaginationItem>
              ))} */}
            </PaginationContent>
            <PaginationButton onClick={() => handlePageChange(page + 1)} disabled={page >= Math.ceil(total / limit)}>
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </PaginationButton>
          </Pagination>
        </>
      )}
    </div>
  );
};

export default ProductList;
