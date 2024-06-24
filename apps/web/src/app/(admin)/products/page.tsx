"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation'; 
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '@/lib/fetch-api/product';
import { fetchCategories } from '@/lib/fetch-api/category';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/partial/SearchBar';
import EditForm from './_components/editform';
import CreateForm from './_components/createform';
import { Product } from './_components/types';
import { Category } from '../categories/_components/types';
import Pagination from '@/components/partial/pagination';
import ProductCard from './_components/productcard';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toaster, toast } from '@/components/ui/sonner';

const ProductList = () => {
  const router = useRouter();
  const pathname = usePathname(); 
  const searchParams = useSearchParams(); 
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [updateFlag, setUpdateFlag] = useState<boolean>(false);

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
        toast.error('Failed to fetch data', {
          className: 'bg-red-500 text-white',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limit, filters, updateFlag]);

  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
      setSearchQuery(query);
      setFilters((prevFilters: any) => ({ ...prevFilters, search: query }));
    }
  }, [searchParams]);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCreate = async (newProduct: FormData) => {
    try {
      const createdProduct = await createProduct(newProduct);
      toast.success('Product created successfully', {
        className: 'bg-green-500 text-white',
      });
      setUpdateFlag(!updateFlag);
      setCreatingProduct(false);
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product', {
        className: 'bg-red-500 text-white',
      });
    }
  };

  const handleUpdate = async (updatedProduct: FormData) => {
    try {
      const productId = selectedProduct?.id;
      if (productId) {
        updatedProduct.append('id', productId);
        const product = await updateProduct(productId, updatedProduct);
        toast.success('Product updated successfully', {
          className: 'bg-green-500 text-white',
        });
        setUpdateFlag(!updateFlag);
        setSelectedProduct(null);
      } else {
        throw new Error('Product ID is missing');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product', {
        className: 'bg-red-500 text-white',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      toast.success('Product deleted successfully', {
        className: 'bg-green-500 text-white',
      });
      setUpdateFlag(!updateFlag);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product', {
        className: 'bg-red-500 text-white',
      });
    }
  };

  const handleTitleClick = (id: string) => {
    router.push(`/products/${id}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    const url = `${pathname}?${params.toString()}`;
    router.replace(url);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ ...filters, search: query });
    const params = new URLSearchParams(searchParams);
    params.set('search', query);
    params.set('page', '1'); // Reset to the first page when searching
    const url = `${pathname}?${params.toString()}`;
    router.replace(url);
  };

  const handleCategoryFilterChange = (categoryId: string) => {
    if (categoryId === 'all') {
      setFilters((filters: any) => {
        const newFilters = { ...filters };
        delete newFilters.categoryId;
        return newFilters;
      });
    } else {
      setFilters((filters: any) => ({ ...filters, categoryId }));
    }
    const params = new URLSearchParams(searchParams);
    if (categoryId === 'all') {
      params.delete('categoryId');
    } else {
      params.set('categoryId', categoryId);
    }
    params.set('page', '1'); 
    const url = `${pathname}?${params.toString()}`;
    router.replace(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-600">Products</h2>
      <p className="text-lg mb-8 text-center text-gray-700">Manage your products here.</p>
      <SearchBar onSearch={handleSearch} />
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
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onTitleClick={() => handleTitleClick(product.id)}
              />
            ))}
          </div>
          {selectedProduct && (
            <EditForm product={selectedProduct} onUpdate={handleUpdate} onCancel={() => setSelectedProduct(null)} />
          )}
          {creatingProduct && (
            <CreateForm onCreate={handleCreate} onCancel={() => setCreatingProduct(false)} />
          )}
          <Pagination
            total={total}
            page={page}
            limit={limit}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default ProductList;
