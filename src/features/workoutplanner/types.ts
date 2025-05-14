import { Timestamp } from 'firebase/firestore';

/**
 * Represents a scheduled exercise in a workout plan.
 * This is used for tracking exercises that are part of a scheduled workout session.
 */
export interface IExerciseBase {
  exerciseId: string;
  name: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  date?: Timestamp;
}

/**
 * Represents the result of an exercise search.
 * This is used for displaying search results in the UI.
 */
export interface IExerciseSearchResultItem extends IExerciseBase {
  gifUrl?: string;
  targetMuscles?: string[];
  bodyParts?: string[];
  equipments?: string[];
  secondaryMuscles?: string[];
  instructions?: string[];
}

/**
 * Represents a scheduled exercise in a workout plan.
 * This is used for tracking exercises that are part of a scheduled workout session.
 */
export interface IPlannedExercise extends IExerciseBase {
  sets?: number;
  reps?: number;
  weight?: number;
}

/**
 * Represents a workout template.
 * This is used for defining a workout routine that can be scheduled.
 */

export interface IWorkout {
  id: string;
  name: string;
  completed?: boolean;
  exercises: IPlannedExercise[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Schedule for workout
 */
export interface IPlannedWorkouts {
  id: string;
  name: string;
  workouts: IWorkout[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  date?: Timestamp;
}
