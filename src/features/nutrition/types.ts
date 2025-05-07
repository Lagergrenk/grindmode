import { Timestamp } from 'firebase/firestore';

export interface IFoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  unit: string;
}

export interface IMeal {
  id: string;
  name: string;
  time: Timestamp;
  foods: IFoodItem[];
}

export interface INutritionEntry {
  id?: string;
  meals?: IMeal[];
  dailyTotals?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  notes?: string;
  date: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// USDA FOODDATA TYPES
export interface IFoodSearchResult {
  fdcId: number;
  description: string;
  brandName?: string;
  brandOwner?: string;
  ingredientList?: string;
  foodNutrients: Array<{
    nutrientId: number;
    nutrientName: string;
    nutrientNumber: string;
    unitName: string;
    value: number;
  }>;
}

export interface INutrientInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}
