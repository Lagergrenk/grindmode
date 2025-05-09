import { useCallback, useState } from 'react';
import { IMeal, INutritionEntry } from '@/features/nutrition/types';
import {
  addNutritionEntry,
  getNutritionEntryById,
  updateNutritionEntry,
} from '@/features/nutrition/firestore';
import { calculateTotal } from '@/shared/utils/calculateTotalNutrients';

interface IMealOperationsProps {
  nutritionEntry?: INutritionEntry;

  onEntryUpdated: (updatedEntry?: INutritionEntry) => void;
}

export const useMealOperations = ({
  nutritionEntry,
  onEntryUpdated,
}: IMealOperationsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNewEntryWithMeal = useCallback(
    async (meal: IMeal): Promise<boolean> => {
      const dailyTotals = {
        calories: calculateTotal([meal], 'calories'),
        protein: calculateTotal([meal], 'protein'),
        carbs: calculateTotal([meal], 'carbs'),
        fat: calculateTotal([meal], 'fat'),
      };

      try {
        const newEntryId = await addNutritionEntry({
          meals: [meal],
          dailyTotals,
        });

        if (!newEntryId) {
          setError('Failed to create nutrition entry');
          return false;
        }

        const newEntry = await getNutritionEntryById(newEntryId);
        if (!newEntry) {
          setError('Failed to fetch new nutrition entry');
          return false;
        }

        onEntryUpdated(newEntry);
        return true;
      } catch (error) {
        console.error('Error creating nutrition entry:', error);
        setError('Failed to create new nutrition entry');
        return false;
      }
    },
    [onEntryUpdated],
  );

  const addMealToExistingEntry = useCallback(
    async (meal: IMeal): Promise<boolean> => {
      if (!nutritionEntry || !nutritionEntry.id) {
        setError('Missing nutrition entry');
        return false;
      }

      const updatedMeals = [...(nutritionEntry.meals || []), meal];

      const dailyTotals = {
        calories: calculateTotal(updatedMeals, 'calories'),
        protein: calculateTotal(updatedMeals, 'protein'),
        carbs: calculateTotal(updatedMeals, 'carbs'),
        fat: calculateTotal(updatedMeals, 'fat'),
      };

      const success = await updateNutritionEntry(nutritionEntry.id, {
        meals: updatedMeals,
        dailyTotals,
      });

      if (!success) {
        setError('Failed to add meal to existing entry');
        return false;
      }

      const updatedEntry: INutritionEntry = {
        ...nutritionEntry,
        meals: updatedMeals,
        dailyTotals,
      };
      onEntryUpdated(updatedEntry);
      return true;
    },
    [nutritionEntry, onEntryUpdated],
  );

  const addMeal = useCallback(
    async (meal: IMeal): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        if (!nutritionEntry?.id) {
          return await createNewEntryWithMeal(meal);
        }
        return await addMealToExistingEntry(meal);
      } catch (error) {
        console.error('Error in addMeal operation:', error);
        setError('An error occurred while processing the meal');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [nutritionEntry, createNewEntryWithMeal, addMealToExistingEntry],
  );
  // Edit an existing meal
  const editMeal = useCallback(
    async (index: number, updatedMeal: IMeal): Promise<boolean> => {
      if (!nutritionEntry?.id || !nutritionEntry.meals) {
        setError('Cannot edit meal: No nutrition entry or meals exist');
        return false;
      }

      if (index < 0 || index >= nutritionEntry.meals.length) {
        setError('Invalid meal index');
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Create new meals array with the updated meal
        const updatedMeals = [...nutritionEntry.meals];
        updatedMeals[index] = updatedMeal;
        // Calculate new totals
        const dailyTotals = {
          calories: calculateTotal(updatedMeals, 'calories'),
          protein: calculateTotal(updatedMeals, 'protein'),
          carbs: calculateTotal(updatedMeals, 'carbs'),
          fat: calculateTotal(updatedMeals, 'fat'),
        };

        // Update the entry
        const success = await updateNutritionEntry(nutritionEntry.id, {
          meals: updatedMeals,
          dailyTotals,
        });

        if (success) {
          const updatedEntry = {
            ...nutritionEntry,
            meals: updatedMeals,
            dailyTotals,
          };
          onEntryUpdated(updatedEntry); // Trigger refresh in parent
          return true;
        }

        setError('Failed to update meal');
        return false;
      } catch (err) {
        console.error('Error editing meal:', err);
        setError('An error occurred while editing the meal');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [nutritionEntry, onEntryUpdated],
  );

  // Delete a meal
  const deleteMeal = useCallback(
    async (index: number): Promise<boolean> => {
      if (!nutritionEntry?.id || !nutritionEntry.meals) {
        setError('Cannot delete meal: No nutrition entry or meals exist');
        return false;
      }

      if (index < 0 || index >= nutritionEntry.meals.length) {
        setError('Invalid meal index');
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Create new meals array without the deleted meal
        const updatedMeals = nutritionEntry.meals.filter((_, i) => i !== index);

        // Calculate new totals
        const dailyTotals = {
          calories: calculateTotal(updatedMeals, 'calories'),
          protein: calculateTotal(updatedMeals, 'protein'),
          carbs: calculateTotal(updatedMeals, 'carbs'),
          fat: calculateTotal(updatedMeals, 'fat'),
        };

        // Update the entry
        const success = await updateNutritionEntry(nutritionEntry.id, {
          meals: updatedMeals,
          dailyTotals,
        });

        if (success) {
          const updatedEntry = {
            ...nutritionEntry,
            meals: updatedMeals,
            dailyTotals,
          };
          onEntryUpdated(updatedEntry); // Trigger refresh in parent
          return true;
        }

        setError('Failed to delete meal');
        return false;
      } catch (err) {
        console.error('Error deleting meal:', err);
        setError('An error occurred while deleting the meal');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [nutritionEntry, onEntryUpdated],
  );

  return {
    addMeal,
    editMeal,
    deleteMeal,
    isLoading,
    error,
  };
};
