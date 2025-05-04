import { DateSelector } from '@/components/nutrition/DateSelector';
import { MealsList } from '@/components/nutrition/lists/MealsList';
import { NutritionNotes } from '@/components/nutrition/NutritionNotes';
import { useNutritionEntry } from '@/hooks/useNutritionEntry';
import { IMeal } from '@/types';
import React, { useState, useCallback } from 'react';
import { AddNewMeal } from '@/components/nutrition/AddNewMeal';
import { useMealOperations } from '@/hooks/useMealOperations';

/**
 * Nutrition tracking page component
 */
export const Nutrition: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formMode, setFormMode] = useState<'hidden' | 'add' | 'edit'>('hidden');
  const [selectedMeal, setSelectedMeal] = useState<IMeal | undefined>(
    undefined,
  );
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const {
    selectedDateNutritionEntries,
    isLoading: isNutritionLoading,
    refreshData,
    updateNotes,
  } = useNutritionEntry(selectedDate);

  // Get the current day's nutrition entry
  const nutritionEntry = selectedDateNutritionEntries[0];

  const {
    addMeal,
    editMeal,
    deleteMeal,
    isLoading: isMealOperationLoading,
  } = useMealOperations({
    nutritionEntry,
    onEntryUpdated: (updatedEntry) => {
      if (updatedEntry) {
        refreshData(updatedEntry);
      } else {
        refreshData();
      }
    },
  });
  const isLoading = isNutritionLoading || isMealOperationLoading;
  // Handle date selection change
  const handleDateChange = useCallback((date: Date) => {
    setSelectedDate(date);
    setFormMode('hidden');
    setSelectedMeal(undefined);
  }, []);

  // Open form to add a new meal
  const handleOpenAddMealForm = () => {
    setFormMode('add');
    setSelectedMeal(undefined);
    setSelectedIndex(-1);
  };

  // Open form to edit an existing meal
  const handleOpenEditMealForm = async (
    index: number,
    meal: IMeal,
  ): Promise<void> => {
    setSelectedMeal(meal);
    setSelectedIndex(index);
    setFormMode('edit');
    return Promise.resolve();
  };

  // Handle meal form submission (add or edit)
  const handleMealFormSubmit = async (meal: IMeal): Promise<void> => {
    try {
      let success = false;
      if (formMode === 'add') {
        success = await addMeal(meal);
      } else if (formMode === 'edit' && selectedIndex !== -1) {
        success = await editMeal(selectedIndex, meal);
      }

      if (success) {
        setFormMode('hidden');
        setSelectedMeal(undefined);
        setSelectedIndex(-1);
      }
    } catch (error) {
      console.error('Error handling meal submission:', error);
    }
  };

  // Cancel the meal form
  const handleCancelForm = () => {
    setFormMode('hidden');
    setSelectedMeal(undefined);
    setSelectedIndex(-1);
  };

  const isFormVisible = formMode !== 'hidden';
  const meals = nutritionEntry?.meals || [];

  return (
    <div className="nutrition-page space-y-4">
      {/* Date Selector */}
      <div className="container mx-auto px-4 max-w-md">
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />
      </div>

      {/* Meals List or Add/Edit Meal Form */}
      <div
        className={
          isFormVisible
            ? 'container mx-auto px-4 max-w-md'
            : 'container mx-auto px-4'
        }
      >
        {isFormVisible ? (
          <AddNewMeal
            onSubmit={handleMealFormSubmit}
            onCancel={handleCancelForm}
            initialMeal={selectedMeal}
            isEditing={formMode === 'edit'}
          />
        ) : (
          <>
            <MealsList
              meals={meals}
              onEditMeal={handleOpenEditMealForm}
              onDeleteMeal={async (index) => {
                await deleteMeal(index);
              }}
              onAddMeal={handleOpenAddMealForm}
              isLoading={isLoading}
            />
          </>
        )}
      </div>

      {/* Nutrition Notes */}
      <div className="container mx-auto px-4 max-w-md pb-8">
        <NutritionNotes
          notes={nutritionEntry?.notes || ''}
          onChange={(newNotes) =>
            updateNotes(nutritionEntry?.id || '', newNotes)
          }
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
