// Dashboard.tsx fix
//Main dashboard with summary widgets
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  DashboardHeader,
  WorkoutSummary,
  NutritionSummary,
  GoalsProgress,
  QuickActions,
} from '@components/dashboard';
import { IGoal } from '@/types';
import { useNutritionEntry } from '@/hooks/useNutritionEntry';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate] = useState(() => new Date());
  const { isLoading, allNutritionEntries, nutritionSummary } =
    useNutritionEntry(selectedDate);

  const exampleGoals: IGoal[] = [
    {
      dailyCalories: 2000,
      dailyProtein: 150,
      weeklyWorkouts: 4,
    },
  ];

  const handleLogWorkout = () => {
    navigate('/dashboard/workouts/');
  };

  const handleLogFood = () => {
    navigate('/dashboard/nutrition/');
  };

  const handleRecordMeasurement = () => {
    navigate('/dashboard/progress/');
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <DashboardHeader userName={user?.displayName || 'User'} />
      <QuickActions
        onAddWorkout={handleLogWorkout}
        onLogFood={handleLogFood}
        onRecordMeasurement={handleRecordMeasurement}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WorkoutSummary onLogWorkout={handleLogWorkout} />
        <NutritionSummary
          isLoading={isLoading}
          nutritionData={nutritionSummary}
          latestEntries={allNutritionEntries.slice(0, 3)}
          onLogFood={handleLogFood}
        />
        <GoalsProgress goals={exampleGoals} />
      </div>
    </div>
  );
};
