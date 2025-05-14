import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAppState } from '@/hooks/useAppState';
import {
  addPlannedWorkout,
  IExerciseSearchResultItem,
  IPlannedExercise,
  IPlannedWorkouts,
  IWorkout,
} from '@/features/workoutplanner';
import { toast } from 'sonner';
import { Timestamp } from 'firebase/firestore';

/**
 * Creates a new IPlannedWorkouts object with default values.
 * @param name - The initial name for the workout plan.
 * @param initialWorkouts - An array of IWorkout to include in the plan.
 * @param userId - Optional ID of the user creating the plan.
 * @returns A new IPlannedWorkouts object.
 */
const createNewPlannedWorkouts = (
  name: string,
  initialWorkouts: IWorkout[],
): IPlannedWorkouts => {
  const now = Timestamp.now();
  return {
    id: `temp-plan-${now.toMillis()}`,
    name,
    workouts: initialWorkouts,
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Custom hook for managing workout planner state and operations.
 * Initializes and manages a single IPlannedWorkouts object.
 */
export const useWorkoutPlanner = () => {
  const { user } = useAuth();
  const { state: appState } = useAppState();
  const numberOfWorkoutsPerWeek = appState.userPreferences.workoutDaysPerWeek;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [plannedWorkouts, setPlannedWorkouts] = useState<
    IPlannedWorkouts | undefined
  >(undefined);

  useEffect(() => {
    setIsLoading(true);
    if (user) {
      const defaultWorkoutTemplates: IWorkout[] = Array.from(
        { length: numberOfWorkoutsPerWeek },
        (_, i) => ({
          id: `workout-template-${Date.now()}-${i}`,
          name: `Workout ${i + 1}`,
          exercises: [],
          completed: false,
        }),
      );
      setPlannedWorkouts(
        createNewPlannedWorkouts('My Workout Plan', defaultWorkoutTemplates),
      );
    } else {
      setPlannedWorkouts(undefined);
    }
    setIsLoading(false);
  }, [user, numberOfWorkoutsPerWeek]);

  const addExerciseToWorkout = useCallback(
    (workoutId: string, exercise: IExerciseSearchResultItem) => {
      setPlannedWorkouts((prevPlan) => {
        if (!prevPlan) return prevPlan;

        const updatedInternalWorkouts = prevPlan.workouts.map((workout) => {
          if (workout.id !== workoutId) return workout;
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
        });

        return {
          ...prevPlan,
          workouts: updatedInternalWorkouts,
          updatedAt: Timestamp.now(),
        };
      });
    },
    [],
  );

  const removeExerciseFromWorkout = useCallback(
    (workoutId: string, exerciseId: string) => {
      setPlannedWorkouts((prevPlan) => {
        if (!prevPlan) return prevPlan;
        let exerciseRemovedName: string | undefined;
        let workoutName: string | undefined;

        const updatedInternalWorkouts = prevPlan.workouts.map((workout) => {
          if (workout.id !== workoutId) return workout;
          const originalExercise = workout.exercises.find(
            (ex) => ex.exerciseId === exerciseId,
          );
          if (originalExercise) {
            exerciseRemovedName = originalExercise.name;
            workoutName = workout.name;
          }
          return {
            ...workout,
            exercises: workout.exercises.filter(
              (ex) => ex.exerciseId !== exerciseId,
            ),
          };
        });
        if (exerciseRemovedName && workoutName) {
          toast('Exercise Removed', {
            description: `"${exerciseRemovedName}" removed from "${workoutName}".`,
          });
        }
        return {
          ...prevPlan,
          workouts: updatedInternalWorkouts,
          updatedAt: Timestamp.now(),
        };
      });
    },
    [],
  );

  /**
   * Updates specific details of an exercise within a workout.
   * @param workoutId - The ID of the workout containing the exercise.
   * @param exerciseId - The ID of the exercise to update.
   * @param updatedExerciseData - An object containing the exercise properties to update. Can be a partial update.
   */
  const updateExerciseInWorkout = useCallback(
    (
      workoutId: string,
      exerciseId: string,
      updatedExerciseData: Partial<IPlannedExercise>,
    ) => {
      setPlannedWorkouts((prevPlan) => {
        if (!prevPlan) return prevPlan;

        const updatedInternalWorkouts = prevPlan.workouts.map((workout) => {
          if (workout.id !== workoutId) {
            return workout;
          }
          const updatedExercises = workout.exercises.map((exercise) => {
            if (exercise.exerciseId !== exerciseId) {
              return exercise;
            }

            const currentExercise = workout.exercises.find(
              (ex) => ex.exerciseId === exerciseId,
            );
            const finalUpdatedData = { ...exercise, ...updatedExerciseData };
            if (updatedExerciseData.sets !== undefined && currentExercise) {
              toast.info(
                `Sets for ${currentExercise.name} updated to ${updatedExerciseData.sets} in ${workout.name}`,
              );
            }

            return finalUpdatedData;
          });
          return { ...workout, exercises: updatedExercises };
        });

        return {
          ...prevPlan,
          workouts: updatedInternalWorkouts,
          updatedAt: Timestamp.now(),
        };
      });
    },
    [],
  );

  const setWorkoutName = useCallback((workoutId: string, newName: string) => {
    setPlannedWorkouts((prevPlan) => {
      if (!prevPlan) return prevPlan;
      const updatedInternalWorkouts = prevPlan.workouts.map((workout) =>
        workout.id === workoutId ? { ...workout, name: newName } : workout,
      );
      return {
        ...prevPlan,
        workouts: updatedInternalWorkouts,
        updatedAt: Timestamp.now(),
      };
    });
  }, []);

  const setWorkoutTitle = useCallback(
    (title: string) => {
      setPlannedWorkouts((prevPlan) => {
        const now = Timestamp.now();
        if (!prevPlan) {
          const defaultTemplates: IWorkout[] = Array.from(
            { length: numberOfWorkoutsPerWeek },
            (_, i) => ({
              id: `workout-template-${Date.now()}-${i}`,
              name: `Workout ${i + 1}`,
              exercises: [],
            }),
          );
          return createNewPlannedWorkouts(title, defaultTemplates);
        }
        return {
          ...prevPlan,
          name: title,
          updatedAt: now,
        };
      });
    },
    [numberOfWorkoutsPerWeek],
  );

  /**
   * Prepares the current workout plan for saving.
   * Ensures ID is finalized and timestamps are current.
   * @returns The IPlannedWorkouts object ready for saving, or undefined if not ready.
   */
  const preparePlanForSave = useCallback((): IPlannedWorkouts | undefined => {
    if (!user) {
      toast.error('User not authenticated. Cannot save workout plan.');
      return undefined;
    }
    if (!plannedWorkouts) {
      toast.error('Workout plan is not initialized. Cannot save.');
      return undefined;
    }

    const planName = plannedWorkouts.name || 'My Workout Plan';
    const now = Timestamp.now();

    const finalId =
      plannedWorkouts.id && !plannedWorkouts.id.startsWith('temp-plan-')
        ? plannedWorkouts.id
        : `${planName.replace(/\s+/g, '-')}-${now.toMillis()}`;

    const planToSave: IPlannedWorkouts = {
      ...plannedWorkouts,
      id: finalId,
      name: planName,
      updatedAt: now,
      createdAt: plannedWorkouts.createdAt || now,
    };

    setPlannedWorkouts(planToSave);
    return planToSave;
  }, [user, plannedWorkouts]);

  const workouts = useMemo(
    () => plannedWorkouts?.workouts || [],
    [plannedWorkouts],
  );

  /**
   * Saves the current workout plan to Firestore.
   * Manages isSaving state and provides user feedback.
   * @returns A promise that resolves to true if successful, false otherwise.
   */
  const saveWorkoutPlan = useCallback(async (): Promise<boolean> => {
    const planToSave = preparePlanForSave();
    if (!planToSave) {
      return false;
    }
    setIsSaving(true);
    try {
      await addPlannedWorkout(planToSave);
      return true;
    } catch (error) {
      console.error('Error saving workout plan:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [preparePlanForSave]);

  return {
    isLoading,
    isSaving,
    plannedWorkouts,
    workouts,
    numberOfWorkoutsPerWeek,
    addExerciseToWorkout,
    removeExerciseFromWorkout,
    updateExerciseInWorkout,
    preparePlanForSave,
    setWorkoutName,
    setWorkoutTitle,
    saveWorkoutPlan,
  };
};
