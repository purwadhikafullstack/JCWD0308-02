"use client"
import React, { useEffect, useState } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '@/lib/fetch-api/product';
import { fetchCategories } from '@/lib/fetch-api/category';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/partial/SearchBar';
import EditForm from './components/editform';
import CreateForm from './components/createform';
import { Product } from './components/types';
import { Category } from '../categories/components/types';
import Pagination from '@/components/partial/pagination';
import ProductCard from './components/productcard';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toaster, toast } from '@/components/ui/sonner';

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
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limit, filters, updateFlag]);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCreate = async (newProduct: FormData) => {
    try {
      const createdProduct = await createProduct(newProduct);
      toast.success('Product created successfully');
      setUpdateFlag(!updateFlag);
      setCreatingProduct(false);
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    }
  };

  const handleUpdate = async (updatedProduct: FormData) => {
    try {
      const product = await updateProduct(updatedProduct.get('id') as string, updatedProduct);
      toast.success('Product updated successfully');
      setUpdateFlag(!updateFlag);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      toast.success('Product deleted successfully');
      setUpdateFlag(!updateFlag);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleTitleClick = (id: string) => {
    window.location.href = `/admin/product/${id}`;
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ ...filters, search: query });
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
                onTitleClick={handleTitleClick}
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
