import { IMeal } from '@/types';
import { Timestamp } from 'firebase/firestore';

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

export const formatTime = (timestamp: Timestamp): string => {
  return `${timestamp.toDate().getHours()}:${timestamp.toDate().getMinutes()}`;
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};
