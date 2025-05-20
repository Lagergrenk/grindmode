// Src/features/workouttracker/firebase.ts
import { Timestamp } from 'firebase/firestore';

import { IActiveWorkout, WorkoutStatus, IActiveExercise } from './types';
import { IWorkout } from '@/features/workoutplanner';
import { FirestoreService, IQueryFilter } from '@/shared';

const activeWorkoutsService = new FirestoreService<IActiveWorkout>(
  'activeWorkouts',
);

/**
 * Starts a new workout from a template.
 * @param plannedWorkout - The workout template to start
 * @param userId - The ID of the current user
 * @returns The newly created active workout
 */
export const startWorkout = async (
  plannedWorkout: IWorkout,
  userId: string,
): Promise<IActiveWorkout> => {
  try {
    const activeExercises: IActiveExercise[] = plannedWorkout.exercises.map(
      (exercise) => {
        const sets = Array(exercise.sets || 1)
          .fill(null)
          .map(() => ({
            weight: exercise.weight || 0,
            reps: exercise.reps || 0,
            isCompleted: false,
          }));

        return {
          exerciseId: exercise.exerciseId,
          name: exercise.name,
          sets,
        };
      },
    );

    const activeWorkout: Omit<IActiveWorkout, 'id'> = {
      originalWorkoutId: plannedWorkout.id,
      name: plannedWorkout.name,
      exercises: activeExercises,
      status: WorkoutStatus.ACTIVE,
      startTime: Timestamp.now(),
      userId,
    };

    const workoutId = await activeWorkoutsService.add(activeWorkout);
    return { ...activeWorkout, id: workoutId } as IActiveWorkout;
  } catch (error) {
    console.error('Error starting workout:', error);
    throw error;
  }
};

/**
 * Updates an active workout.
 * @param workoutId - The ID of the workout to update
 * @param workoutData - The updated workout data
 */
export const updateActiveWorkout = async (
  workoutId: string,
  workoutData: Partial<IActiveWorkout>,
): Promise<void> => {
  try {
    await activeWorkoutsService.update(workoutId, {
      ...workoutData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating workout:', error);
    throw error;
  }
};

/**
 * Completes an active workout.
 * @param workoutId - The ID of the workout to complete
 * @returns The completed workout data
 */
export const completeWorkout = async (
  workoutId: string,
): Promise<IActiveWorkout> => {
  try {
    const existingWorkout = await activeWorkoutsService.getById(workoutId);
    if (!existingWorkout) {
      throw new Error('Workout not found');
    }

    const endTime = Timestamp.now();
    let duration = 0;

    if (existingWorkout.startTime) {
      duration = endTime.seconds - existingWorkout.startTime.seconds;
    }

    const updatedWorkout = {
      status: WorkoutStatus.COMPLETED,
      endTime,
      duration,
      updatedAt: Timestamp.now(),
    };

    await activeWorkoutsService.update(workoutId, updatedWorkout);

    return {
      ...existingWorkout,
      ...updatedWorkout,
    };
  } catch (error) {
    console.error('Error completing workout:', error);
    throw error;
  }
};
/**
 * Gets all active or completed workouts for the current authenticated user.
 * @param status - Optional status filter for workout status
 * @returns Array of active workouts
 */
export const getUserWorkouts = async (
  status?: WorkoutStatus,
): Promise<IActiveWorkout[]> => {
  try {
    // If we want to filter by status, use query method
    if (status) {
      const filters: IQueryFilter[] = [
        { field: 'status', operator: '==', value: status },
      ];
      return await activeWorkoutsService.query(filters);
    }

    // Otherwise, get all workouts
    return await activeWorkoutsService.getAll();
  } catch (error) {
    console.error('Error getting user workouts:', error);
    throw error;
  }
};

/**
 * Gets a specific active workout by ID.
 * @param workoutId - The ID of the active workout
 * @returns The workout data or null if not found
 */
export const getActiveWorkoutById = async (
  workoutId: string,
): Promise<IActiveWorkout | null> => {
  try {
    return await activeWorkoutsService.getById(workoutId);
  } catch (error) {
    console.error('Error getting active workout:', error);
    throw error;
  }
};
