import { IWorkout } from '@/types';
import { FirestoreService } from './firestore.service';

const workoutsService = new FirestoreService<IWorkout>('workouts');

/**
 * Add a new workout to Firestore
 * @param workout - Workout data to add
 */
export const addWorkout = async (
  workout: Omit<IWorkout, 'date'>,
): Promise<string> => {
  try {
    return await workoutsService.add(workout);
  } catch (error) {
    console.error('Error adding workout:', error);
    throw error;
  }
};

/**
 * Get all workouts from Firestore
 */
export const getWorkouts = async (
  max?: number,
): Promise<(IWorkout & { id: string })[]> => {
  try {
    return await workoutsService.getAll(max);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return [];
  }
};

/**
 * Delete a workout from Firestore
 * @param workoutId - ID of the workout to delete
 */
export const deleteWorkout = async (workoutId: string): Promise<boolean> => {
  try {
    return await workoutsService.delete(workoutId);
  } catch (error) {
    console.error('Error deleting workout:', error);
    return false;
  }
};

/**
 * Update a workout in Firestore
 * @param workoutId - ID of the workout to update
 * @param workout - Partial workout data to update
 */
export const updateWorkout = async (
  workoutId: string,
  workout: Partial<IWorkout>,
): Promise<boolean> => {
  try {
    return await workoutsService.update(workoutId, workout);
  } catch (error) {
    console.error('Error updating workout:', error);
    return false;
  }
};

/**
 * Get workouts in a date range
 * @param startDate - start date of the range
 * @param endDate - end date of the range
 */
export const getWorkoutsInDateRange = async (
  startDate: Date,
  endDate: Date,
): Promise<(IWorkout & { id: string })[]> => {
  try {
    return await workoutsService.getByDateRange(startDate, endDate);
  } catch (error) {
    console.error('Error fetching workouts in date range:', error);
    return [];
  }
};

/**
 * Workout summary for the last 7 days
 */
export const getWorkoutSummary = async (): Promise<{
  recentWorkouts: number;
  totalDuration: number;
  lastWorkout: (IWorkout & { id: string }) | null;
}> => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);

    const recentWorkouts = await getWorkoutsInDateRange(startDate, endDate);
    const totalDuration = recentWorkouts.reduce(
      (sum, workout) => sum + (workout.duration || 0),
      0,
    );

    return {
      recentWorkouts: recentWorkouts.length,
      totalDuration,
      lastWorkout: recentWorkouts[0] || null,
    };
  } catch (error) {
    console.error('Error fetching workout summary:', error);
    return { recentWorkouts: 0, totalDuration: 0, lastWorkout: null };
  }
};
