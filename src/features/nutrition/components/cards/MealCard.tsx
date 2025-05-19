import React from 'react';
import { IMeal, FoodsList } from '@/features/nutrition/index';
import { calculateTotal } from '@/shared/utils/calculateTotalNutrients';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { cn } from '@/shared/utils/classMerger';

interface IMealCardProps {
  meal: IMeal;
  className?: string;
  onEdit?: (meal: IMeal) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export const MealCard: React.FC<IMealCardProps> = ({
  meal,
  className,
  onEdit,
  onDelete,
}) => {
  const [expanded, setExpanded] = useState(false);

  // Calculate total calories and protein from all foods in the meal
  const totalCalories = calculateTotal([meal], 'calories');
  const totalProtein = calculateTotal([meal], 'protein');

  // Format timestamp to readable time
  const formattedTime = meal.time
    ? new Date(meal.time.toDate()).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'No time set';

  const toggleExpanded = () => setExpanded((prev) => !prev);

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="py-3 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base capitalize flex items-center">
            {meal.name}
            <Badge variant="outline" className="ml-2 font-normal text-xs">
              {formattedTime}
            </Badge>
          </CardTitle>

          <div className="flex items-center gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onEdit(meal)}
              >
                <Edit2 className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            )}

            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpanded}
              className="h-8 w-8 p-0 ml-1"
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span className="sr-only">
                {expanded ? 'Collapse' : 'Expand'}
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-0">
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            <span>{formattedTime}</span>
          </div>

          <div className="flex gap-3">
            <span className="font-medium">{totalCalories} kcal</span>
            <span className="font-medium">{totalProtein}g protein</span>
          </div>
        </div>

        {expanded && meal.foods.length > 0 && (
          <div className="pt-2 mt-2 border-t">
            <FoodsList foods={meal.foods} />
          </div>
        )}

        {expanded && meal.foods.length === 0 && (
          <div className="py-3 text-center bg-muted/30 rounded-md mt-2">
            <p className="text-sm text-muted-foreground">
              No food items in this meal
            </p>
          </div>
        )}

        {!expanded && meal.foods.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpanded}
            className="w-full mt-1 border border-dashed text-muted-foreground"
          >
            Show {meal.foods.length} food item{meal.foods.length > 1 ? 's' : ''}
          </Button>
        )}
        {expanded && meal.foods.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpanded}
            className="w-full mt-1 border border-dashed text-muted-foreground"
          >
            Hide
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
