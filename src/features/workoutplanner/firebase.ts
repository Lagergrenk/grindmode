import { FirestoreService } from '@/shared';
import { IPlannedWorkouts } from './types';

const workoutsService = new FirestoreService<IPlannedWorkouts>(
  'plannedWorkouts',
);

export const addPlannedWorkout = async (
  workout: IPlannedWorkouts,
): Promise<boolean> => {
  try {
    await workoutsService.add(workout);
    return true;
  } catch (error) {
    console.error('Error adding workout:', error);
    return false;
  }
};

export const getPlannedWorkouts = async (): Promise<
  (IPlannedWorkouts & { id: string })[]
> => {
  try {
    return await workoutsService.getAll();
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return [];
  }
};

export const deletePlannedWorkout = async (
  workoutId: string,
): Promise<boolean> => {
  try {
    await workoutsService.delete(workoutId);
    return true;
  } catch (error) {
    console.error('Error deleting workout:', error);
    return false;
  }
};
