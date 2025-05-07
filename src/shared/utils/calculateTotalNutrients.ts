import { IMeal } from '@/features/nutrition/types';

type Nutrients = 'calories' | 'protein' | 'carbs' | 'fat';
export const calculateTotal = (meals: IMeal[], nutrient: Nutrients): number => {
  return meals.reduce((total, meal) => {
    return (
      total +
      meal.foods.reduce((mealTotal, food) => {
        return mealTotal + food[nutrient] * (food.quantity / 100);
      }, 0)
    );
  }, 0);
};
