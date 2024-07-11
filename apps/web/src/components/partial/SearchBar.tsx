'use client';
import { Search } from 'lucide-react';
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    onSearch(searchQuery);
  };

  return (
    <div className="flex items-center justify-center my-1 px-4 gap-3">
      <div className="relative w-full max-w-md">
        <Input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          className="pr-10 w-full"
        />
        <Button
          onClick={handleSearchSubmit}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
          variant="ghost"
          size="icon"
        >
          <Search className="h-5 w-5 text-gray-500" />
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;