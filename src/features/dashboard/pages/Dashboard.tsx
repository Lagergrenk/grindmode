// Dashboard.tsx fix
//Main dashboard with summary widgets
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

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate] = useState(() => new Date());
  const { isLoading, allNutritionEntries, nutritionSummary } =
    useNutritionEntry(selectedDate);

  const handleLogWorkout = () => {
    navigate('/workoutplanner');
  };

  const handleLogFood = () => {
    navigate('/nutrition');
  };

  const handleRecordMeasurement = () => {
    navigate('/progress');
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Header userName={user?.displayName || 'User'} />
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
      </div>
    </div>
  );
};
