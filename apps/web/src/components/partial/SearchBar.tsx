'use client';
import { ChevronDown, Search } from 'lucide-react';
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
export default function SearchBar() {
  const [categoryDropdown, setCategoryDropdown] = useState<boolean>(false);
  return (
    <div className="flex items-center justify-center my-1 px-4 gap-3">
      <div className="relative">
        <div
          className="flex gap-1 items-center cursor-pointer p-3 rounded-xl hover:text-destructive"
          onClick={() => setCategoryDropdown(!categoryDropdown)}
        >
          <button className="bg-transparent border-none text-sm">
            Categories
          </button>
          <ChevronDown
            className={`transition-transform ${categoryDropdown ? 'rotate-180' : ''}`}
          />
        </div>
        {categoryDropdown && (
          <div className="absolute left-0 mt-2 bg-muted border rounded-xl shadow-lg z-10 w-48">
            <ul className="py-1">
              <li className="hover:bg-accent hover:text-accent-foreground rounded-xl p-2">
                FOOD
              </li>
              <li className="hover:bg-accent hover:text-accent-foreground rounded-xl p-2">
                BEVERAGE
              </li>
              <li className="hover:bg-accent hover:text-accent-foreground rounded-xl p-2">
                HOME AND LIVING
              </li>
              <li className="hover:bg-accent hover:text-accent-foreground rounded-xl p-2">
                HEALTH
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="relative w-full max-w-md">
        <Input type="text" placeholder="Search" className="pr-10 w-full" />
        <Button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
          variant="ghost"
          size="icon"
        >
          <Search className="h-5 w-5 text-gray-500" />
        </Button>
      </div>
    </div>
  );
}
