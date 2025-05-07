import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, X } from 'lucide-react';

interface IFoodSearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  onClear: () => void;
  isLoading: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;

  inputRef: React.RefObject<HTMLInputElement | null>;
}

export const FoodSearchBar: React.FC<IFoodSearchBarProps> = ({
  query,
  onQueryChange,
  onSearch,
  onClear,
  isLoading,
  onKeyDown,
  inputRef,
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for a food..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="pr-8"
        />
        {query && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={onSearch}
        disabled={isLoading || !query.trim() || query.trim().length < 2}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
        <span className="sr-only">Search</span>
      </Button>
    </div>
  );
};
