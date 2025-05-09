import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { IFoodSearchResult } from '@/features/nutrition/types';
import { usdaApi } from '@/features/nutrition/api';

interface IFoodSearchItemProps {
  food: IFoodSearchResult;
  onSelect: (food: IFoodSearchResult) => void;
  buttonLabel?: string;
}

export const FoodSearchItem: React.FC<IFoodSearchItemProps> = ({
  food,
  onSelect,
  buttonLabel = 'Add',
}) => {
  const nutrients = usdaApi.extractNutrients(food);

  return (
    <div className="p-3 hover:bg-accent/50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1 cursor-pointer" onClick={() => onSelect(food)}>
          <h4 className="font-medium text-sm">{food.description}</h4>
          {food.brandOwner && (
            <p className="text-xs text-muted-foreground truncate max-w-[90%]">
              {food.brandOwner}
            </p>
          )}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {Math.round(nutrients.calories)} cal
            </span>
            <span>P: {nutrients.protein.toFixed(1)}g</span>
            <span>C: {nutrients.carbs.toFixed(1)}g</span>
            <span>F: {nutrients.fat.toFixed(1)}g</span>
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onSelect(food)}
          className="h-7 px-2"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
};
