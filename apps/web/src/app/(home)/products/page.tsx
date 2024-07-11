'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Category } from '@/lib/types/category';
import { NearestStock } from '@/lib/types/stock';
import { useSuspenseQuery } from '@tanstack/react-query';
import Pagination from '@/components/partial/pagination';
import { handleApiError } from '@/components/toast/toastutils';
import { getNearestStocks } from '@/lib/fetch-api/stocks/client';
import { getSelectedAddress } from '@/lib/fetch-api/address/client';
import { fetchCategories } from '@/lib/fetch-api/category/client';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { ProductCard } from '@/components/shared/product-card';

// const ProductCard: React.FC<{ product: NearestStock['product'], amount: number, onTitleClick: (slug: string) => void }> = ({ product, amount, onTitleClick }) => {
//   return (
//     <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
//       <div className="relative w-full h-64">
//         {product.images && product.images.length > 0 ? (
//           <Image
//             src={product.images[0].imageUrl}
//             alt={product.title}
//             layout="fill"
//             objectFit="cover"
//             className="rounded-t-lg"
//             priority
//           />
//         ) : (
//           <div className="relative w-full h-full flex items-center justify-center bg-gray-200">
//             <span className="text-gray-500">No Image Available</span>
//           </div>
//         )}
//       </div>
//       <div className="relative z-20 mt-2">
//         <div className="h-20 flex items-center justify-center text-center">
//           <h3 className="font-semibold text-base text-primary overflow-hidden overflow-ellipsis whitespace-normal line-clamp-3" onClick={() => onTitleClick(product.slug)}>
//             {product.title}
//           </h3>
//         </div>
//         <div className="h-12 mt-2 flex flex-col justify-center">
//           <p className="text-xs font-semibold text-gray-500 line-through">
//             Rp {product.price?.toLocaleString() ?? 'N/A'}
//           </p>
//           <p className="text-xl font-semibold text-primary">
//             Rp {product.discountPrice?.toLocaleString() ?? 'N/A'}
//           </p>
//         </div>
//       </div>
//       <div className="mt-4">
//         {amount > 0 ? (
//           <Link href={`/products/detail/${product.slug}`}>
//             <div className="bg-primary text-white text-center py-2 w-full rounded-lg cursor-pointer hover:bg-primary-dark transition-colors hover:shadow-lg">
//               Buy
//             </div>
//           </Link>
//         ) : (
//           <div className="bg-gray-500 text-white text-center py-2 w-full rounded-lg cursor-not-allowed">
//             Product Out of Stock
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

const ProductPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [limit, setLimit] = useState<number>(15);

  const selectedAddress = useSuspenseQuery({
    queryKey: ['selected-address'],
    queryFn: getSelectedAddress,
  });

  const nearestStocks = useSuspenseQuery({
    queryKey: ['nearest-stocks', page, limit, searchParams.toString()],
    queryFn: async () => {
      const filters = {
        categoryId: searchParams.get('categoryId') || '',
        search: searchParams.get('search') || '',
        sortcol: searchParams.get('sortcol') || '',
      };
      return getNearestStocks(page, limit, filters);
    },
  });

  useEffect(() => {
    fetchCategories()
      .then((data) =>
        setCategories([
          { id: 'all', name: 'All Categories', superAdminId: '' },
          ...data,
        ]),
      )
      .catch((error) => {
        console.error('Error fetching categories:', error);
        setError('Failed to fetch categories');
        handleApiError(error, 'Failed to fetch categories');
      });
  }, []);

  useEffect(() => {
    if (nearestStocks.data) {
      setLoading(false);
      setTotal(nearestStocks.data.total);
    }
  }, [nearestStocks.data]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    const url = `${pathname}?${params.toString()}`;
    router.replace(url);
  };

  const handleCategoryFilterChange = (categoryId: string) => {
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

  const handleTitleClick = (slug: string) => {
    router.push(`/products/detail/${slug}`);
  };

  if (!nearestStocks.data?.stocks?.length)
    return (
      <div className="h-full w-full flex items-center justify-center">
        <h1>Sorry, we are out of stock! :(</h1>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4">
          Welcome to Our Featured Products
        </h1>
        <p className="text-lg text-gray-700">
          Discover the best deals and enjoy shopping with us!
        </p>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="w-1/4">
          <Select onValueChange={handleCategoryFilterChange}>
            <SelectTrigger aria-label="Category Filter">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="text-gray-700 mb-4">
        Showing {nearestStocks.data.stocks.length} of {total} products
      </div>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {nearestStocks.data.stocks.map(
              (stock: NearestStock, index: number) => (
                <ProductCard stock={stock} key={stock.id} />
              ),
            )}
          </div>
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

export default ProductPage;
