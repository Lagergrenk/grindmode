import React from 'react';
import { IMeal, MealCard } from '@/features/nutrition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils, Loader2, PlusCircle } from 'lucide-react';
import { Button, Skeleton } from '@/components/ui';

interface IMealsListProps {
  meals: IMeal[];
  onDeleteMeal: (index: number) => Promise<void>;
  onEditMeal: (index: number, meal: IMeal) => Promise<void>;
  onAddMeal?: () => void;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const MealsList: React.FC<IMealsListProps> = ({
  meals,
  onDeleteMeal,
  onEditMeal,
  onAddMeal,
  isLoading = false,
  children,
}) => {
  const SKELETON_COUNT = 3;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Utensils className="h-5 w-5" />
          {isLoading && (
            <Loader2 className="h-4 w-4 ml-2 animate-spin text-muted-foreground" />
          )}
        </CardTitle>

        {/* Add Meal Button */}
        {onAddMeal && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAddMeal}
            className="h-8 gap-1"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Add Meal</span>
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array(SKELETON_COUNT)
              .fill(0)
              .map((_, index) => (
                <Card
                  key={`skeleton-${index}`}
                  className="h-[180px] overflow-hidden"
                >
                  <div className="p-4 h-full flex flex-col">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <div className="flex space-x-2 mb-3">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex-1" />
                    <div className="flex justify-between items-center pt-2 mt-auto">
                      <Skeleton className="h-4 w-16" />
                      <div className="flex space-x-2">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        ) : meals.length > 0 ? (
          <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {meals.map((meal, index) => (
              <MealCard
                key={`meal-${meal.id || index}`}
                meal={meal}
                onDelete={() => onDeleteMeal(index)}
                onEdit={() => onEditMeal(index, meal)}
                className="h-full"
              />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center border-dashed border rounded-md bg-muted/40">
            <p className="text-muted-foreground">No meals logged.</p>
          </div>
        )}

        {children && <div className="pt-3">{children}</div>}
      </CardContent>
    </Card>
  );
};
