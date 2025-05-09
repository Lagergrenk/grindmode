import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAppState } from '@/hooks/useAppState';
import {
  IExerciseSearchResultItem,
  IPlannedExercise,
  IPlannedWorkouts,
  IWorkout,
} from '@/features/workoutplanner';
import { toast } from 'sonner';
import { Timestamp } from 'firebase/firestore';

/**
 * Custom hook for managing workout planner state and operations
 * Handles loading, manipulating, and storing workout data
 */
export const useWorkoutPlanner = () => {
  const { user } = useAuth();
  const { state } = useAppState();
  const [numberOfWorkoutsPerWeek] = useState<number>(
    state.userPreferences.workoutDaysPerWeek,
  );
  const [workouts, setWorkouts] = useState<IWorkout[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [plannedWorkouts, setPlannedWorkouts] = useState<IPlannedWorkouts>();

  useEffect(() => {
    const initializeWorkoutTemplates = () => {
      setIsLoading(true);
      if (user) {
        const defaultTemplates: IWorkout[] = Array.from(
          { length: numberOfWorkoutsPerWeek },
          (_, i) => ({
            id: `workout-template-${Date.now()}-${i}`,
            name: `Workout ${i + 1}`,
            exercises: [],
          }),
        );
        setWorkouts(defaultTemplates);
      } else {
        setWorkouts([]);
      }
      setIsLoading(false);
    };

    initializeWorkoutTemplates();
  }, [user, numberOfWorkoutsPerWeek]);

  /**
   * Adds an exercise definition to a specific workout template.
   * Ensures that an exercise is not added if it already exists in the template.
   * @param workoutId - The ID of the workout template.
   * @param exercise - The exercise definition to add.
   */
  const addExerciseToWorkout = useCallback(
    (workoutId: string, exercise: IExerciseSearchResultItem) => {
      setWorkouts((prevWorkouts) =>
        prevWorkouts.map((workout) => {
          if (workout.id !== workoutId) {
            return workout;
          }
          if (
            workout.exercises.some(
              (ex) => ex.exerciseId === exercise.exerciseId,
            )
          ) {
            toast.error('Exercise Already Exists', {
              description: `"${exercise.name}" is already in "${workout.name}".`,
            });
            return workout;
          }
          const plannedExercise: IPlannedExercise = {
            ...exercise,
            sets: 1,
            reps: 10,
            weight: 0,
          };

          toast('Exercise Added', {
            description: `"${exercise.name}" added to "${workout.name}".`,
          });
          return {
            ...workout,
            exercises: [...workout.exercises, plannedExercise],
          };
        }),
      );
    },
    [],
  );

  /**
   * Removes an exercise from a specific workout template.
   * @param workoutId - The ID of the workout template.
   * @param exerciseId - The ID of the exercise to remove.
   */
  const removeExerciseFromWorkout = useCallback(
    (workoutId: string, exerciseId: string) => {
      setWorkouts((prevWorkouts) => {
        const workoutIndex = prevWorkouts.findIndex(
          (workout) => workout.id === workoutId,
        );

        if (workoutIndex === -1) {
          return prevWorkouts;
        }

        const updatedWorkouts = [...prevWorkouts];
        const targetWorkout = updatedWorkouts[workoutIndex];
        const exerciseToRemove = targetWorkout.exercises.find(
          (ex) => ex.exerciseId === exerciseId,
        );

        updatedWorkouts[workoutIndex] = {
          ...targetWorkout,
          exercises: targetWorkout.exercises.filter(
            (ex) => ex.exerciseId !== exerciseId,
          ),
        };

        if (exerciseToRemove) {
          toast('Exercise Removed', {
            description: `"${exerciseToRemove.name}" removed from "${targetWorkout.name}".`,
          });
        }

        return updatedWorkouts;
      });
    },
    [],
  );

  /**
   * Adds a new set to an exercise in a workout template.
   * This typically means incrementing the planned number of sets.
   * @param workoutId - The ID of the workout template.
   * @param exerciseId - The ID of the exercise within the workout.
   */
  const addSetToExercise = useCallback(
    (workoutId: string, exerciseId: string) => {
      setWorkouts((prevWorkouts) =>
        prevWorkouts.map((workout) => {
          if (workout.id !== workoutId) {
            return workout;
          }

          const updatedExercises = workout.exercises.map((exercise) => {
            if (exercise.exerciseId !== exerciseId) {
              return exercise;
            }
            toast.info(`Set added to ${exercise.name} in ${workout.name}`);
            return {
              ...exercise,
              sets: (exercise.sets || 0) + 1,
            };
          });

          return {
            ...workout,
            exercises: updatedExercises,
          };
        }),
      );
    },
    [],
  );

  /**
   * Removes a set from an exercise in a workout template.
   * This typically means decrementing the planned number of sets.
   * @param workoutId - The ID of the workout template.
   * @param exerciseId - The ID of the exercise within the workout.
   */
  const removeSetFromExercise = useCallback(
    (workoutId: string, exerciseId: string) => {
      setWorkouts((prevWorkouts) =>
        prevWorkouts.map((workout) => {
          if (workout.id !== workoutId) {
            return workout;
          }

          const updatedExercises = workout.exercises.map((exercise) => {
            if (exercise.exerciseId !== exerciseId) {
              return exercise;
            }
            toast.info(`Set removed from ${exercise.name} in ${workout.name}`);
            return {
              ...exercise,
              sets: Math.max((exercise.sets || 0) - 1, 0),
            };
          });

          return {
            ...workout,
            exercises: updatedExercises,
          };
        }),
      );
    },
    [],
  );

  const saveWorkoutsToPlannedWorkouts = useCallback(() => {
    if (user) {
      const plannedWorkoutsData: IPlannedWorkouts = {
        id: `planned-workout-${Date.now()}`,
        name: 'Planned Workouts',
        workouts: workouts,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      setPlannedWorkouts(plannedWorkoutsData);
    }
  }, [user, workouts]);

  return {
    isLoading,
    workouts,
    plannedWorkouts,
    numberOfWorkoutsPerWeek,

    addExerciseToWorkout,
    removeExerciseFromWorkout,
    addSetToExercise,
    removeSetFromExercise,
    saveWorkoutsToPlannedWorkouts,
  };
};
