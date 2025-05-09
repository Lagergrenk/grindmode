import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import {
  DetailsDialog,
  ExerciseItem,
  IWorkout,
  SearchPanel,
  SelectionDialog,
  useExerciseData,
  useWorkoutPlanner,
  WorkoutColumn,
} from '@/features/workoutplanner';
import {
  IExerciseSearchResultItem,
  IPlannedExercise,
} from '@/features/workoutplanner';
import { Skeleton } from '@/components/ui';
import { addPlannedWorkout } from '@/features/workoutplanner/';
import { toast } from 'sonner';
import { getFirestoreErrorMessage } from '@/shared/utils/firestoreErrorHandler';

export const WorkoutPlanner: React.FC = () => {
  const {
    workouts,
    plannedWorkouts,
    isLoading,
    addExerciseToWorkout,
    removeExerciseFromWorkout,
    addSetToExercise,
    removeSetFromExercise,
    saveWorkoutsToPlannedWorkouts,
  } = useWorkoutPlanner();

  const {
    searchTerm,
    searchResults,
    isSearching,
    error: searchError,
    setSearchTerm,
    selectExercise: fetchExerciseDetails,
  } = useExerciseData();

  const [currentWorkoutIdForOps, setCurrentWorkoutIdForOps] = useState<
    string | null
  >(null);
  const [exerciseDetailsToShow, setExerciseDetailsToShow] =
    useState<IExerciseSearchResultItem | null>(null);

  const handleOpenAddExerciseDialog = (workoutId: string) => {
    setCurrentWorkoutIdForOps(workoutId);
  };

  const handleViewExerciseDetails = async (exerciseId: string) => {
    const details = await fetchExerciseDetails(exerciseId);
    if (details) {
      setExerciseDetailsToShow(details);
    }
  };

  const handleSelectExerciseForWorkout = (
    exerciseDefinition: IExerciseSearchResultItem,
  ) => {
    if (currentWorkoutIdForOps) {
      addExerciseToWorkout(currentWorkoutIdForOps, exerciseDefinition);
    }
    handleCloseModals();
  };

  const handleAddExerciseToWorkout = (exerciseId: string) => {
    if (currentWorkoutIdForOps) {
      const selectedExercise = searchResults.find(
        (exercise) => exercise.exerciseId === exerciseId,
      );
      if (selectedExercise) {
        addExerciseToWorkout(currentWorkoutIdForOps, selectedExercise);
      }
    }
  };

  const handleCloseModals = () => {
    setCurrentWorkoutIdForOps(null);
    setExerciseDetailsToShow(null);
  };

  const handleAddAllWorkoutsToFirebase = async () => {
    try {
      saveWorkoutsToPlannedWorkouts();
      if (!plannedWorkouts) return;
      await addPlannedWorkout(plannedWorkouts);

      toast.success('Workouts added successfully!');
    } catch (error) {
      toast.error(
        `Failed to add workouts. Please try again: ${getFirestoreErrorMessage(error)}`,
      );
    }
  };

  if (isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Plan your workout</h1>
        <p className="text-sm text-gray-500">
          You prefer to work out {workouts.length} times a week.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workouts.map((workout: IWorkout) => (
          <Card key={workout.id} id={`workout-${workout.id}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{workout.name}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full mb-4"
                onClick={() => handleOpenAddExerciseDialog(workout.id)}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Exercise
              </Button>
              <div className="space-y-4">
                {workout.exercises.map((plannedExercise: IPlannedExercise) => (
                  <WorkoutColumn
                    key={plannedExercise.exerciseId}
                    plannedExercise={plannedExercise}
                    workout={workout}
                    removeExerciseFromWorkout={removeExerciseFromWorkout}
                    handleViewExerciseDetails={handleViewExerciseDetails}
                  >
                    <ExerciseItem
                      exercise={plannedExercise}
                      onAddSet={() =>
                        addSetToExercise(workout.id, plannedExercise.exerciseId)
                      }
                      onDeleteSet={() =>
                        removeSetFromExercise(
                          workout.id,
                          plannedExercise.exerciseId,
                        )
                      }
                    />
                  </WorkoutColumn>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DetailsDialog
        exercise={exerciseDetailsToShow}
        isOpen={!!exerciseDetailsToShow}
        onClose={handleCloseModals}
      />

      <SelectionDialog
        title={`Add Exercise to ${
          workouts.find((w) => w.id === currentWorkoutIdForOps)?.name ||
          'Workout'
        }`}
        isOpen={!!currentWorkoutIdForOps}
        onClose={handleCloseModals}
        onSelectExercise={handleSelectExerciseForWorkout}
        onViewExercise={() => console.log('')}
      >
        <SearchPanel
          searchTerm={searchTerm}
          searchResults={searchResults}
          isSearching={isSearching}
          error={searchError}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          onSelectExercise={handleAddExerciseToWorkout}
          onViewExercise={handleViewExerciseDetails}
        />
      </SelectionDialog>
      {/* Save button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="default"
          onClick={handleAddAllWorkoutsToFirebase}
          disabled={isLoading}
        >
          Save Workout Templates
        </Button>
      </div>
    </div>
  );
};
