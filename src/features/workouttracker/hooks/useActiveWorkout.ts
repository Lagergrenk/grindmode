// Src/features/workouttracker/hooks/useActiveWorkout.ts
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { IActiveWorkout, ISet, WorkoutStatus, IWorkoutStats } from '../types';
import {
  getActiveWorkoutById,
  updateActiveWorkout,
  completeWorkout,
} from '../firebase';
import { toast } from 'sonner';
import { Timestamp } from 'firebase/firestore';

/**
 * Custom hook for managing an active workout session.
 * @param workoutId - The ID of the workout to track
 * @returns Methods and state for the active workout
 */
export const useActiveWorkout = (workoutId?: string) => {
  const [workout, setWorkout] = useState<IActiveWorkout | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load workout data
  useEffect(() => {
    const fetchWorkout = async () => {
      if (!workoutId || !user) return;

      try {
        setLoading(true);
        const result = await getActiveWorkoutById(workoutId);

        if (!result) {
          setError('Workout not found');
          return;
        }

        if (result.userId !== user.uid) {
          setError('You do not have permission to view this workout');
          return;
        }

        setWorkout(result);
      } catch (err) {
        setError('Failed to load workout data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [workoutId, user]);

  /**
   * Updates a set's completion status and data.
   * @param exerciseIndex - The index of the exercise
   * @param setIndex - The index of the set within the exercise
   * @param data - The updated set data
   */
  const updateSet = useCallback(
    async (exerciseIndex: number, setIndex: number, data: Partial<ISet>) => {
      if (!workout?.id || !user) return;

      try {
        const updatedExercises = [...workout.exercises];
        const currentSets = [...updatedExercises[exerciseIndex].sets];

        currentSets[setIndex] = {
          ...currentSets[setIndex],
          ...data,
        };

        updatedExercises[exerciseIndex] = {
          ...updatedExercises[exerciseIndex],
          sets: currentSets,
        };

        // Update local state immediately for responsive UI
        setWorkout((prev) =>
          prev
            ? {
                ...prev,
                exercises: updatedExercises,
              }
            : null,
        );

        // Persist to database
        await updateActiveWorkout(workout.id, {
          exercises: updatedExercises,
        });

        toast.success('Set updated');
      } catch (err) {
        toast.error('Failed to update set');
        console.error(err);
      }
    },
    [workout, user],
  );

  /**
   * Adds a new set to an exercise.
   * @param exerciseIndex - The index of the exercise
   */
  const addSet = useCallback(
    async (exerciseIndex: number) => {
      if (!workout?.id || !user) return;

      try {
        const updatedExercises = [...workout.exercises];
        const currentExercise = updatedExercises[exerciseIndex];

        // Create a new set based on the last set if available
        const lastSet =
          currentExercise.sets.length > 0
            ? currentExercise.sets[currentExercise.sets.length - 1]
            : { weight: 0, reps: 0, isCompleted: false };

        const newSet: ISet = {
          weight: lastSet.weight,
          reps: lastSet.reps,
          isCompleted: false,
        };

        updatedExercises[exerciseIndex] = {
          ...currentExercise,
          sets: [...currentExercise.sets, newSet],
        };

        // Update local state
        setWorkout((prev) =>
          prev
            ? {
                ...prev,
                exercises: updatedExercises,
              }
            : null,
        );

        // Persist to database
        await updateActiveWorkout(workout.id, {
          exercises: updatedExercises,
        });

        toast.success('Set added');
      } catch (err) {
        toast.error('Failed to add set');
        console.error(err);
      }
    },
    [workout, user],
  );

  /**
   * Marks the workout as complete.
   */
  const finishWorkout = useCallback(async () => {
    if (!workout?.id || !user) return;

    try {
      // First check if we have permission by validating user ownership
      if (workout.userId !== user.uid) {
        toast.error('You do not have permission to complete this workout');
        return;
      }
      await completeWorkout(workout.id);
      toast.success('Workout completed!');

      setWorkout((prev) =>
        prev
          ? {
              ...prev,
              status: WorkoutStatus.COMPLETED,
              endTime: Timestamp.now(),
            }
          : null,
      );

      navigate(`/workout/summary/${workout.id}`);
    } catch (err) {
      // Improved error handling with more specific messages based on error type
      if (err instanceof Error) {
        const errorMessage = err.message;
        if (errorMessage.includes('permission')) {
          toast.error(
            "Access denied: You don't have permission to complete this workout",
          );
          console.error('Permission error:', err);
        } else {
          toast.error(`Failed to complete workout: ${errorMessage}`);
          console.error('Error completing workout:', err);
        }
      } else {
        toast.error('An unknown error occurred');
        console.error('Unknown error:', err);
      }
    }
  }, [workout, user, navigate]);

  /**
   * Calculates statistics for the current workout.
   * @returns Workout statistics
   */
  const calculateStats = useCallback((): IWorkoutStats => {
    if (!workout)
      return {
        totalSets: 0,
        totalCompletedSets: 0,
        totalReps: 0,
        totalWeight: 0,
        totalExercises: 0,
      };

    let totalSets = 0;
    let totalCompletedSets = 0;
    let totalReps = 0;
    let totalWeight = 0;

    workout.exercises.forEach((exercise) => {
      totalSets += exercise.sets.length;

      exercise.sets.forEach((set) => {
        if (set.isCompleted) {
          totalCompletedSets++;
          totalReps += set.reps;
          totalWeight += set.weight * set.reps;
        }
      });
    });

    return {
      totalSets,
      totalCompletedSets,
      totalReps,
      totalWeight,
      totalExercises: workout.exercises.length,
    };
  }, [workout]);

  return {
    workout,
    loading,
    error,
    updateSet,
    addSet,
    finishWorkout,
    calculateStats,
  };
};
