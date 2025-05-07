import { IFoodItem } from '@/features/nutrition/types';

// Validate form fields
export const validateFoodForm = (formData: IFoodItem) => {
  const newErrors = {
    name: '',
    quantity: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  };

  let isValid = true;

  if (!formData.name.trim()) {
    newErrors.name = 'Food name is required';
    isValid = false;
  }

  if (formData.quantity <= 0) {
    newErrors.quantity = 'Quantity must be greater than 0';
    isValid = false;
  }

  if (formData.calories < 0) {
    newErrors.calories = 'Calories cannot be negative';
    isValid = false;
  }

  if (formData.protein < 0) {
    newErrors.protein = 'Protein cannot be negative';
    isValid = false;
  }

  if (formData.carbs < 0) {
    newErrors.carbs = 'Carbs cannot be negative';
    isValid = false;
  }

  if (formData.fat < 0) {
    newErrors.fat = 'Fat cannot be negative';
    isValid = false;
  }

  return { isValid, newErrors };
};
