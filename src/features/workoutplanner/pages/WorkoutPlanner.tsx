import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import {
  DetailsDialog,
  SearchPanel,
  SelectionDialog,
  WeekNavHeader,
  WorkoutDayColumn,
  WorkoutWeekView,
  useExerciseData,
  useWorkoutPlanner,
} from '@/features/workoutplanner';
import { IExerciseDefinition, IScheduledExercise } from '@/types/workout.types';

/**
 * Main workout planner page component
 * Allows users to plan and manage their weekly workouts
 */
export const WorkoutPlanner: React.FC = () => {
  // Fetch workout data and operations from our hook
  const {
    workoutDays,
    isLoading,
    handleNavigateWeek,
    handleDeleteExercise,
    handleDuplicateExercise,
    handleAddExerciseToDay,
    isToday,
  } = useWorkoutPlanner();

  const {
    searchTerm,
    searchResults,
    isSearching,
    error,
    setSearchTerm,
    selectExercise,
  } = useExerciseData();

  // Local state for UI interactions
  const [selectedDayName, setSelectedDayName] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<
    IExerciseDefinition | IScheduledExercise | null
  >(null);
  const [viewMode, setViewMode] = useState<'view' | 'edit' | null>(null);

  /**
   * Returns singular or plural form of "day" based on count
   * @param num - Number of days
   */
  const getDayWord = (num: number) => (num === 1 ? 'day' : 'days');

  /**
   * Handles initiating the add exercise flow for a specific day
   * @param dayName - The day to add an exercise to (e.g., "Monday")
   */
  const handleAddExercise = (dayName: string) => {
    setSelectedDayName(dayName);
  };

  /**
   * Handles viewing exercise details
   * @param exercise - The exercise to view details for
   */
  const handleViewExercise = (
    exercise: IScheduledExercise | IExerciseDefinition,
  ) => {
    selectExercise(exercise);
    setViewMode('view');
  };

  /**
   * Handles editing an exercise
   * @param exercise - The exercise to edit
   */
  const handleEditExercise = (exercise: IScheduledExercise) => {
    setSelectedExercise(exercise);
    setViewMode('edit');
  };

  /**
   * Handles selecting an exercise from the search dialog
   * @param exercise - The selected exercise to add to a day
   */
  const handleSelectExercise = async (exercise: IExerciseDefinition) => {
    const selectedExercise = await selectExercise(exercise.id);
    if (selectedExercise) {
      setSelectedExercise(selectedExercise);
      setViewMode('edit');
    } else {
      setSelectedExercise(null);
      setViewMode(null);
    }
  };

  /**
   * Closes all open modals and dialogs
   */
  const handleCloseModals = () => {
    setSelectedExercise(null);
    setViewMode(null);
    setSelectedDayName(null);
  };

  // Determine how many workout days per week the user prefers
  const workoutDaysPerWeek =
    workoutDays.filter((day) => day.isRecommendedWorkoutDay).length || 3;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Workout Planner</h1>

      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You prefer working out {workoutDaysPerWeek}{' '}
          {getDayWord(workoutDaysPerWeek)} per week.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-4">
        <WeekNavHeader onNavigateWeek={handleNavigateWeek} />
        <WorkoutWeekView isLoading={isLoading}>
          {workoutDays.map((day) => (
            <WorkoutDayColumn
              key={day.dayName}
              day={day}
              isToday={day.date ? isToday(day.date) : false}
              onAddExercise={handleAddExercise}
              onEditExercise={handleEditExercise}
              onViewExercise={handleViewExercise}
              onDeleteExercise={handleDeleteExercise}
              onDuplicateExercise={handleDuplicateExercise}
              id={`day-${day.dayName}`}
            />
          ))}
        </WorkoutWeekView>
      </div>

      {/* Exercise Detail Dialog */}
      <DetailsDialog
        exercise={selectedExercise}
        isOpen={!!selectedExercise}
        onClose={handleCloseModals}
        onSave={handleAddExerciseToDay}
        mode={viewMode}
      />

      {/* Exercise Selection Dialog */}
      <SelectionDialog
        dayName={selectedDayName}
        isOpen={!!selectedDayName}
        onClose={handleCloseModals}
        onSelectExercise={handleSelectExercise}
        onViewExercise={handleViewExercise}
      >
        <SearchPanel
          searchTerm={searchTerm}
          searchResults={searchResults}
          isSearching={isSearching}
          error={error}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          onSelectExercise={(exercise) => {
            selectExercise(exercise);
            handleSelectExercise(exercise);
          }}
          onViewExercise={handleViewExercise}
        />
      </SelectionDialog>
    </div>
  );
};
