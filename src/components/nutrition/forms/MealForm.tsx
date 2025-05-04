import React, { useState } from 'react';
import { MealDetailsForm } from './MealsDetailsForm';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils } from 'lucide-react';
import { FormError } from '@/components/ui/form-error';
import { Timestamp } from 'firebase/firestore';
import {
  formatTimeStampToTimeString,
  formatTimeStringToTimestamp,
} from '../shared/utils';

interface IMealFormProps {
  onSubmit: (mealData: { name: string; time: Timestamp }) => Promise<void>;
  onCancel: () => void;
  initialMeal?: { name: string; time: Timestamp };
  isEditing?: boolean;
}

export const MealForm: React.FC<IMealFormProps> = ({
  onSubmit,
  onCancel,
  initialMeal,
  isEditing = false,
}) => {
  // Form state
  const [mealName, setMealName] = useState<string>(initialMeal?.name || '');
  const [mealTime, setMealTime] = useState<Timestamp>(
    initialMeal?.time || Timestamp.now(),
  );
  const [formErrors, setFormErrors] = useState({ mealName: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation
  const validateForm = () => {
    const errors = { mealName: '' };
    let isValid = true;

    if (!mealName) {
      errors.mealName = 'Meal type is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      await onSubmit({
        name: mealName,
        time: mealTime,
      });
    } catch (error) {
      console.error('Error submitting meal form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Meal details handlers
  const handleMealNameChange = (value: string) => {
    setMealName(value);
    if (value) {
      setFormErrors((prev) => ({ ...prev, mealName: '' }));
    }
  };

  const handleMealTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMealTime(formatTimeStringToTimestamp(e.target.value));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className="h-5 w-5" />
          {isEditing ? 'Edit Meal' : 'Add New Meal'}
        </CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <MealDetailsForm
            name={mealName}
            time={formatTimeStampToTimeString(mealTime)}
            onNameChange={handleMealNameChange}
            onTimeChange={handleMealTimeChange}
          />

          {formErrors.mealName && <FormError message={formErrors.mealName} />}
        </CardContent>

        <CardFooter className="flex justify-end gap-2 border-t pt-4 mt-1">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Saving...'
              : isEditing
                ? 'Save Changes'
                : 'Save Meal'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
