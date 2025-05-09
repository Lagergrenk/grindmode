import { forwardRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { IFoodSearchResult } from '@/features/nutrition/types';
import { FoodSearchItem } from './FoodSearchItem';
import { ScrollArea } from '@/components/ui/scroll-area';

interface IFoodSearchResultsProps {
  isLoading: boolean;
  error: string | null;
  results: IFoodSearchResult[];
  onSelectFood: (food: IFoodSearchResult) => void;
  buttonLabel?: string;
  showInline?: boolean;
  className?: string;
}

export const FoodSearchResults = forwardRef<
  HTMLDivElement,
  IFoodSearchResultsProps
>(
  (
    {
      isLoading,
      error,
      results,
      onSelectFood,
      buttonLabel = 'Add',
      showInline = false,
      className = '',
    },
    ref,
  ) => {
    return (
      <Card
        ref={ref}
        className={`${showInline ? '' : 'absolute z-50 left-0 right-0 top-[calc(100%+0.5rem)]'} shadow-md ${className}`}
      >
        <CardContent className="p-0 overflow-hidden">
          {
            isLoading ? (
              <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </div>
            ) : error ? (
              <div className="p-4 text-sm text-destructive">{error}</div>
            ) : results.length > 0 ? (
              <ScrollArea className="max-h-64 overflow-y-scroll">
                {results.map((food) => (
                  <FoodSearchItem
                    key={food.fdcId}
                    food={food}
                    onSelect={onSelectFood}
                    buttonLabel={buttonLabel}
                  />
                ))}
              </ScrollArea>
            ) : null /* No message for empty results */
          }
        </CardContent>
      </Card>
    );
  },
);

FoodSearchResults.displayName = 'FoodSearchResults';
