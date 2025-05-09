import React, { useState } from 'react';
import { MealForm } from './forms/MealForm';
import { FoodItemForm } from './forms/FoodItemForm';
import { IFoodItem, IMeal } from '@/features/nutrition/types';
import { Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { PlusCircle, Edit, Trash2, ArrowLeft, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface IMealData {
  name: string;
  time: Timestamp;
}

interface IAddNewMealProps {
  onSubmit: (mealData: IMeal) => Promise<void>;
  onCancel: () => void;
  initialMeal?: IMeal;
  isEditing?: boolean;
}

export const AddNewMeal: React.FC<IAddNewMealProps> = ({
  onSubmit,
  onCancel,
  initialMeal,
  isEditing = false,
}) => {
  // States for meal creation workflow
  const [step, setStep] = useState<'meal' | 'food'>('meal');
  const [mealData, setMealData] = useState<IMealData>({
    name: initialMeal?.name || '',
    time: initialMeal?.time || Timestamp.now(),
  });
  const [foodItems, setFoodItems] = useState<IFoodItem[]>(
    initialMeal?.foods || [],
  );

  // States for food item editing
  const [isEditingFood, setIsEditingFood] = useState(false);
  const [currentFoodItem, setCurrentFoodItem] = useState<IFoodItem | null>(
    null,
  );
  const [editingFoodIndex, setEditingFoodIndex] = useState<number | null>(null);

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle meal form submission
  const handleMealSubmit = async (data: IMealData) => {
    setMealData(data);
    setStep('food');
  };

  // Add a new food item
  const handleAddFood = () => {
    setIsEditingFood(true);
    setCurrentFoodItem(null);
    setEditingFoodIndex(null);
  };

  // Edit an existing food item
  const handleEditFood = (index: number) => {
    setIsEditingFood(true);
    setCurrentFoodItem(foodItems[index]);
    setEditingFoodIndex(index);
  };

  // Remove a food item
  const handleRemoveFood = (index: number) => {
    setFoodItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle food form submission
  const handleFoodSubmit = (foodItem: IFoodItem) => {
    if (editingFoodIndex !== null) {
      // Update existing food item
      setFoodItems((prev) =>
        prev.map((item, i) => (i === editingFoodIndex ? foodItem : item)),
      );
    } else {
      // Add new food item
      setFoodItems((prev) => [...prev, foodItem]);
    }

    // Reset editing state
    setIsEditingFood(false);
    setCurrentFoodItem(null);
    setEditingFoodIndex(null);
  };

  // Cancel food editing
  const handleFoodCancel = () => {
    setIsEditingFood(false);
    setCurrentFoodItem(null);
    setEditingFoodIndex(null);
  };

  // Go back to meal details
  const handleBackToMeal = () => {
    setStep('meal');
  };

  // Final submission of the complete meal
  const handleFinalize = async () => {
    if (!mealData || foodItems.length === 0) return;

    setIsSubmitting(true);

    try {
      const completeMeal: IMeal = {
        id: initialMeal?.id || `meal-${Date.now()}`,
        name: mealData.name,
        time: mealData.time,
        foods: foodItems,
      };

      await onSubmit(completeMeal);
    } catch (error) {
      console.error('Error submitting meal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totals = foodItems.reduce(
    (acc, food) => {
      acc.calories += (food.calories * food.quantity) / 100;
      acc.protein += (food.protein * food.quantity) / 100;
      acc.carbs += (food.carbs * food.quantity) / 100;
      acc.fat += (food.fat * food.quantity) / 100;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit Meal' : 'Add New Meal'}
          {step === 'food' && (
            <Badge className="ml-2">{foodItems.length} items</Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {step === 'meal' ? (
          // Step 1: Meal Details Form
          <MealForm
            onSubmit={handleMealSubmit}
            onCancel={onCancel}
            initialMeal={mealData}
            isEditing={isEditing}
          />
        ) : (
          // Step 2: Food Items
          <div className="space-y-4">
            {/* Meal summary */}
            <div className="bg-muted p-3 rounded-md flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium capitalize">
                  {mealData.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {new Date(mealData.time.toMillis()).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleBackToMeal}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>

            {isEditingFood ? (
              // Food Item Form
              <div className="border rounded-lg p-4">
                <FoodItemForm
                  onSubmit={handleFoodSubmit}
                  onCancel={handleFoodCancel}
                  initValues={currentFoodItem || undefined}
                />
              </div>
            ) : (
              // Food Items List and Add Button
              <div className="space-y-3">
                {foodItems.length > 0 && (
                  <div className="space-y-2">
                    {/* Food items list */}
                    {foodItems.map((food, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-3 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{food.name}</p>
                          <div className="flex gap-3 text-sm text-muted-foreground">
                            <span>
                              {food.quantity} {food.unit}
                            </span>
                            <span>{food.calories} kcal</span>
                            <span>{food.protein}g protein</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditFood(index)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFood(index)}
                            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {/* Nutrition totals */}
                    <div className="bg-secondary/40 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium text-sm">
                          Total calories:
                        </span>
                        <span className="font-medium text-sm">
                          {totals.calories} kcal
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-sm">
                          Total protein:
                        </span>

                        <span className="font-medium text-sm">
                          {totals.protein}g
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-sm">
                          Total carbs:
                        </span>
                        <span className="font-medium text-sm">
                          {totals.carbs}g
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-sm">Total fat:</span>
                        <span className="font-medium text-sm">
                          {totals.fat}g
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Add new food button */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleAddFood}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {foodItems.length ? 'Add Another Food' : 'Add Food Item'}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {step === 'food' && !isEditingFood && (
        <CardFooter className="border-t pt-4 flex justify-between">
          <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleBackToMeal}
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleFinalize}
              disabled={foodItems.length === 0 || isSubmitting}
            >
              <Check className="h-4 w-4 mr-2" />
              {isSubmitting
                ? 'Saving...'
                : isEditing
                  ? 'Update Meal'
                  : 'Add Meal'}
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
