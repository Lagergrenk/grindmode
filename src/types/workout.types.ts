import { Timestamp } from 'firebase/firestore';

export interface IExercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  duration?: number;
  notes?: string;
}

export interface IWorkout {
  id?: string;
  name: string;
  date: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  exercises: IExercise[];
  notes?: string;
  duration?: number;
}

/**
 * Search result for exercises from the exercise API
 */
export interface IExerciseSearchResult {
  exerciseId: string;
  name: string;
  gifUrl: string;
  intructions: string[];
  targetMuscles: string[];
  bodyParts: string[];
  equipments: string[];
  secoundaryMuscles: string[];
}
