'use client';
import React, { useState } from 'react';
import CardItem from './_component/CardItem';
import { Button } from '@/components/ui/button';

export default function ProductPage() {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');

  const handleLocationChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedLocation(event.target.value);
    // Perform filtering or other actions based on selected location
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPrice(event.target.value);
    // Perform filtering or other actions based on selected price
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
      <CardItem />
    </div>
  );
}
