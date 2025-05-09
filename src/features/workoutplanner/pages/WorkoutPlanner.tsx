import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2, PlusCircle } from 'lucide-react';
import {
  DetailsDialog,
  ExerciseItem,
  IWorkout,
  SearchPanel,
  SelectionDialog,
  useExerciseData,
  useWorkoutPlanner,
  WorkoutColumn,
  IExerciseSearchResultItem,
  IPlannedExercise,
} from '@/features/workoutplanner';

import { EditableText } from '@/components/ui/editable-text';
import { toast } from 'sonner';

export const WorkoutPlanner: React.FC = () => {
  const {
    workouts,
    plannedWorkouts,
    isLoading,
    isSaving,
    addExerciseToWorkout,
    removeExerciseFromWorkout,
    updateExerciseInWorkout,
    setWorkoutTitle,
    setWorkoutName,
    saveWorkoutPlan,
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
    setSearchTerm('');
  };

  const handleModifySet = (
    workoutId: string,
    exercise: IPlannedExercise,
    increase: boolean,
  ) => {
    const currentSets = exercise.sets || 0;
    const newSets = increase ? currentSets + 1 : Math.max(0, currentSets - 1);
    updateExerciseInWorkout(workoutId, exercise.exerciseId, {
      sets: newSets,
    });
  };

  const handleValueChange = (
    workoutId: string,
    exercise: IPlannedExercise,
    reps: number | string,
    property: 'reps' | 'weight',
  ) => {
    console.log('reps', reps);
    const parsedReps = typeof reps === 'string' ? parseInt(reps, 10) : reps;
    if (!isNaN(parsedReps)) {
      updateExerciseInWorkout(workoutId, exercise.exerciseId, {
        [property]: parsedReps,
      });
    }
  };

  const handleAddPlannedWorkoutsToFirebase = async () => {
    const success = await saveWorkoutPlan();
    if (success) {
      toast.success('Workout plan saved successfully!');
    } else {
      toast.error('Failed to save workout plan.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <EditableText
          as="h1"
          className="text-2xl font-bold"
          initialValue={plannedWorkouts?.name || ''}
          onSave={(newValue) => setWorkoutTitle(newValue)}
        />
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
                  <EditableText
                    className="text-sm font-semibold"
                    initialValue={workout.name}
                    onSave={(newValue) => setWorkoutName(workout.id, newValue)}
                  />
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
                        handleModifySet(workout.id, plannedExercise, true)
                      }
                      onDeleteSet={() =>
                        handleModifySet(workout.id, plannedExercise, false)
                      }
                      OnSaveReps={(reps) =>
                        handleValueChange(
                          workout.id,
                          plannedExercise,
                          reps,
                          'reps',
                        )
                      }
                      OnSaveWeight={(weight) =>
                        handleValueChange(
                          workout.id,
                          plannedExercise,
                          weight,
                          'weight',
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
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="default"
          onClick={handleAddPlannedWorkoutsToFirebase}
          disabled={isLoading || !plannedWorkouts}
        >
          {isSaving && <Loader2 className="animate-spin mr-2" />}
          Save Workout Plan
        </Button>
      </div>
    </div>
  );
};
