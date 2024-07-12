'use client';
import React, { useState, useMemo, useEffect, KeyboardEvent } from 'react';
import debounce from 'lodash.debounce';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  suggestions: string[];
}

const SearchBarDebounce: React.FC<SearchBarProps> = ({ onSearch, suggestions }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const debouncedSearch = useMemo(() => {
    return debounce((query: string) => {
      onSearch(query);
    }, 300);
  }, [onSearch]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = suggestions
        .filter((suggestion) => suggestion && suggestion.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 5);
      setFilteredSuggestions(filtered);
      debouncedSearch(searchQuery);
    } else {
      setFilteredSuggestions([]);
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch, suggestions]);

  const handleSearchSubmit = () => {
    if (activeSuggestion >= 0 && activeSuggestion < filteredSuggestions.length) {
      setSearchQuery(filteredSuggestions[activeSuggestion]);
      onSearch(filteredSuggestions[activeSuggestion]);
    } else {
      onSearch(searchQuery);
    }
    setShowSuggestions(false);
    setActiveSuggestion(-1);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    setActiveSuggestion(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    } else if (e.key === 'ArrowDown') {
      setActiveSuggestion((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

  return (
    <div className="relative w-full max-w-4xl">
      <Input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        className="pr-10 w-full"
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute bg-white border-white w-full mt-1 max-h-60 overflow-y-auto z-10 rounded-sm">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className={`cursor-pointer p-2 hover:bg-slate-100 hover:border-2 hover:text-primary hover:border-primary hover:rounded-sm ${
                activeSuggestion === index ? 'bg-slate-100 border-2 text-primary border-primary rounded-sm' : ''
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      <Button
        onClick={handleSearchSubmit}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
        variant="ghost"
        size="icon"
      >
        <Search className="h-5 w-5 text-gray-500" />
      </Button>
    </div>
  );
};

export default SearchBarDebounce;
