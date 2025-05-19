import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { IExerciseSearchResultItem } from '../../types';
import { cn } from '@/shared/utils/classMerger';
import { SearchResults } from './SearchResults';

/**
 * Props for the ExerciseSearchPanel component
 */
interface IExerciseSearchPanelProps {
  searchTerm: string;
  searchResults: IExerciseSearchResultItem[];
  isSearching: boolean;
  error: string | null;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectExercise: (exerciseId: string) => void;
  onViewExercise?: (exerciseId: string) => void;
  className?: string;
}

/**
 * Exercise search panel component
 */
export const SearchPanel: React.FC<IExerciseSearchPanelProps> = ({
  searchTerm,
  searchResults,
  isSearching,
  error,
  onSearchChange,
  onSelectExercise,
  onViewExercise,
  className,
}) => {
  return (
    <Card className={cn('h-full flex flex-col', className)}>
      <CardHeader className="py-3 px-3">
        <CardTitle className="text-base">Exercise Library</CardTitle>
      </CardHeader>
      <div className="px-3 pb-2">
        <div className="relative">
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={onSearchChange}
            className="pr-8"
          />
          <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <CardContent className="flex-1 p-2 overflow-y-auto max-h-[calc(100vh-200px)]">
        {isSearching ? (
          <div className="flex items-center justify-center h-24">
            <p className="text-sm text-muted-foreground">Searching...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-24">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : searchTerm.trim() !== '' && searchResults.length === 0 ? (
          <div className="flex items-center justify-center h-24">
            <p className="text-sm text-muted-foreground">No exercises found</p>
          </div>
        ) : searchTerm.trim() === '' ? (
          <div className="flex items-center justify-center h-24">
            <p className="text-sm text-muted-foreground">
              Enter a keyword to search exercises
            </p>
          </div>
        ) : (
          <SearchResults
            searchResults={searchResults}
            onSelectExercise={onSelectExercise}
            onViewExercise={onViewExercise}
          />
        )}
      </CardContent>
    </Card>
  );
};
