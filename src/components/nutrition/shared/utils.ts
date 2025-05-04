import { IFoodItem } from '@/types';
import { Timestamp } from 'firebase/firestore';

export function getInitialTimeString(timestamp?: Timestamp): string {
  if (timestamp) {
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTimeStringToTimestamp(time: string): Timestamp {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return Timestamp.fromDate(date);
}

export function formatTimeStampToTimeString(timestamp: Timestamp): string {
  const date = timestamp.toDate();
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

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
    newErrors.calories = 'Protein cannot be negative';
    isValid = false;
  }

  if (formData.carbs < 0) {
    newErrors.calories = 'Carbs cannot be negative';
    isValid = false;
  }
  if (formData.fat < 0) {
    newErrors.calories = 'Fat cannot be negative';
    isValid = false;
  }

  return { isValid, newErrors };
};
