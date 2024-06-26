'use client';
import React, { useEffect, useState } from 'react';
import { CardItem } from './_component/CardItem';
import { Button } from '@/components/ui/button';
import { getStore } from '@/lib/fetch-api/store';
import { Product } from '../../../../lib/types/product';
import { addCart } from '@/lib/fetch-api/cart';
import { useAppDispatch, useAppSelector } from '@/lib/features/hooks';
import { addCartItem, addToCart } from '@/lib/features/cart/cartSlice';
import { CartRequestType } from '../../../../lib/types/cart';
import { selectSelectedAddressId } from '@/lib/features/address/addressSlice';

export default function ProductPage() {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const storeId = 'ce276990-0f7c-442e-8972-f7c8bc2e714d';
  const dispatch = useAppDispatch();
  const selectAddressId = useAppSelector(selectSelectedAddressId);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const storeData = await getStore(storeId);
        const { stocks } = storeData.data;
        const fetchedProducts = stocks.map((stock: any) => stock.product);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching store data:', error);
      }
    };

    fetchStoreData();
  }, []);

  const handleLocationChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedLocation(event.target.value);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPrice(event.target.value);
  };

  const handleAddToCart = (productId: string, isPack: boolean) => {
    try {
      const cartRequest: CartRequestType = {
        productId,
        quantity: 1,
        isPack,
        addressId: selectAddressId ?? ``,
      };
      // Dispatching addCartItem directly with cartRequest
      dispatch(addCartItem(cartRequest))
        .unwrap()
        .then((response) => {
          dispatch(addToCart(response));
          alert('Product added to cart!');
        })
        .catch((error) => {
          console.error('Error adding product to cart:', error);
        });
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };
  return (
    <div className="flex">
      <div className="bg-muted w-96 min-h-screen p-5 flex flex-col">
        <h1 className="font-bold text-2xl">Filter</h1>

        {/* Location Filter Dropdown */}
        <div className="mt-4">
          <label
            htmlFor="locationSelect"
            className="block font-medium text-gray-700"
          >
            Location:
          </label>
          <select
            id="locationSelect"
            className="mt-1 p-3 block w-full rounded-md border-destructive shadow-sm focus:border-secondary focus:ring focus:ring-gray-300 focus:ring-opacity-50 sm:text-sm"
            value={selectedLocation}
            onChange={handleLocationChange}
          >
            <option value="">Select location...</option>
            <option value="Jawa Barat">Jawa Barat</option>
            <option value="Jawa Tengah">Jawa Tengah</option>
            <option value="Jawa Timur">Jawa Timur</option>
            {/* Add more location options as needed */}
          </select>
        </div>

        {/* Price Filter Dropdown */}
        <div className="mt-4">
          <label
            htmlFor="priceSelect"
            className="block font-medium text-gray-700"
          >
            Price:
          </label>
          <select
            id="priceSelect"
            className="mt-1 p-3 block w-full rounded-md border-destructive shadow-sm focus:border-secondary focus:ring focus:ring-gray-300 focus:ring-opacity-50 sm:text-sm"
            value={selectedPrice}
            onChange={handlePriceChange}
          >
            <option value="">Select price range...</option>
            <option value="Under Rp50.000">Under Rp50.000</option>
            <option value="Rp50.000 - Rp100.000">Rp50.000 - Rp100.000</option>
            <option value="Above Rp100.000">Above Rp100.000</option>
            {/* Add more price range options as needed */}
          </select>
        </div>
      </div>
      <div>
        {products.map((product) => (
          <CardItem
            key={product.id}
            product={product}
            addToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}
