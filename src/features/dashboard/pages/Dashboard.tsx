import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  Header,
  WorkoutSummary,
  NutritionSummary,
  QuickActions,
} from '@/features/dashboard';

import { useNutritionEntry } from '@/features/nutrition/hooks/useNutritionEntry';
import { useCompletedWorkoutEntry } from '@/features/workouttracker/hooks/useCompletedWorkoutEntry';

/**
 * Main dashboard component displaying summary widgets for the user's fitness activity
 */
export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate] = useState(() => new Date());
  const {
    isLoading: nutritionLoading,
    allNutritionEntries,
    nutritionSummary,
  } = useNutritionEntry(selectedDate);

  // Use the custom hook for workout data
  const {
    isLoading: workoutsLoading,
    error: workoutsError,
    workoutSummary,
  } = useCompletedWorkoutEntry();

  const handleLogWorkout = () => {
    navigate('/workoutplanner');
  };

  const handleLogFood = () => {
    navigate('/nutrition');
  };

  const handleViewWorkoutHistory = () => {
    navigate('/workouts');
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Header userName={user?.displayName || 'User'} />
      <QuickActions onAddWorkout={handleLogWorkout} onLogFood={handleLogFood} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WorkoutSummary
          onLogWorkout={handleLogWorkout}
          isLoading={workoutsLoading}
          workoutData={workoutSummary}
          onViewHistory={handleViewWorkoutHistory}
          error={workoutsError}
        />
        <NutritionSummary
          isLoading={nutritionLoading}
          nutritionData={nutritionSummary}
          latestEntries={allNutritionEntries.slice(0, 3)}
          onLogFood={handleLogFood}
        />
      </div>
    </div>
  );
};
