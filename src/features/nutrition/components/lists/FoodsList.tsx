import React from 'react';
import { IFoodItem } from '@/features/nutrition/index';
import { Badge } from '@/components/ui/badge';

interface IFoodsListProps {
  foods: IFoodItem[];
  className?: string;
}

export const FoodsList: React.FC<IFoodsListProps> = ({
  foods,
  className = '',
}) => {
  if (!foods || foods.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {foods.map((food, index) => (
        <div
          key={`food-${index}`}
          className="bg-background border rounded-md p-3"
        >
          <div className="flex justify-between items-start">
            <div>
              <h5 className="font-medium text-sm">{food.name}</h5>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                <span>
                  {food.quantity} {food.unit}
                </span>
                <span>{food.calories} calories</span>
                <span>{food.protein}g protein</span>
              </div>
            </div>

            <Badge variant="outline" className="text-xs">
              {index + 1}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};
