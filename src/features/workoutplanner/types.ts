import { Timestamp } from 'firebase/firestore';

/**
 * Base exercise interface with common properties
 */
export interface IExerciseBase {
  id?: string;
  name: string;
  notes?: string;
}

/**
 * Detailed exercise definition for the exercise library
 */
export interface IExerciseDefinition extends IExerciseBase {
  muscleGroup: string;
  equipment?: string;
  instructions?: string[];
  imageUrl?: string;
  targetMuscles?: string[];
  secondaryMuscles?: string[];
  bodyParts?: string[];
}

/**
 * Exercise with tracking metrics for workouts
 */
export interface IExerciseWithMetrics extends IExerciseBase {
  sets: number;
  reps: number;
  weight: number;
  duration?: number;
  completed?: boolean;
}

/**
 * Search result for exercises from the exercise API
 */
export interface IExerciseSearchResult {
  exerciseId: string;
  name: string;
  gifUrl?: string;
  instructions?: string[];
  targetMuscles?: string[];
  bodyParts?: string[];
  equipments?: string[];
  secoundaryMuscles?: string[];
  score?: number;
}

/**
 * Completed workout session
 */
export interface IWorkout {
  id?: string;
  name: string;
  date: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  exercises: IExerciseWithMetrics[];
  notes?: string;
  duration?: number;
}

/**
 * Scheduled exercise for workout planning
 */
export interface IScheduledExercise extends IExerciseDefinition {
  sets?: number;
  reps?: number;
  weight?: number;
  notes?: string;
  completed?: boolean;
}

/**
 * Workout day for weekly planning
 */
export interface IWorkoutDay {
  date: Date;
  dayName: string; // Monday, Tuesday, etc.
  exercises: IScheduledExercise[];
  isRecommendedWorkoutDay?: boolean;
}

/**
 * Weekly workout plan
 */
export interface IWorkoutWeek {
  days: IWorkoutDay[];
  startDate: Date;
}
