import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IFoodSearchResult } from '@/features/nutrition/types';
import { usdaApi } from '@/features/nutrition/api';
import { useDebounce } from '@/hooks/useDebounce';
import { FoodSearchBar } from './FoodSearchBar';
import { FoodSearchResults } from './FoodSearchResults';

interface IFoodSearchProps {
  onSelectFood: (food: IFoodSearchResult) => void;
  buttonLabel?: string;
  autoFocus?: boolean;
  showInline?: boolean;
}

export const FoodSearch: React.FC<IFoodSearchProps> = ({
  onSelectFood,
  buttonLabel = 'Add',
  autoFocus = false,
  showInline = false,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<IFoodSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search query to prevent excessive API calls
  const debouncedQuery = useDebounce(query, 300);

  // Handle clicks outside of dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current !== event.target
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSearch = useCallback(async () => {
    if (!query.trim() || query.trim().length < 2) return;

    setIsLoading(true);
    setError(null);
    setShowDropdown(true);

    try {
      const foods = await usdaApi.searchFoods(query);
      setResults(foods);

      if (foods.length === 0) {
        setError('No foods found matching your search.');
      }
    } catch (err) {
      setError('Failed to search foods. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setError(null);
    setShowDropdown(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSelectFood = (food: IFoodSearchResult) => {
    setShowDropdown(false);
    onSelectFood(food);
    if (!showInline) {
      clearSearch();
    } else {
      setResults([]);
      setError(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  // Auto-search when query changes (with debounce)
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      handleSearch();
    }
  }, [debouncedQuery, handleSearch]);

  return (
    <div className="relative w-full">
      <FoodSearchBar
        inputRef={inputRef}
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        onClear={clearSearch}
        isLoading={isLoading}
        onKeyDown={handleKeyDown}
      />

      {showDropdown && (
        <FoodSearchResults
          ref={dropdownRef}
          isLoading={isLoading}
          error={error}
          results={results}
          onSelectFood={handleSelectFood}
          buttonLabel={buttonLabel}
          showInline={showInline}
        />
      )}
    </div>
  );
};
