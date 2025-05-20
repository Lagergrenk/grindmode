import { Timestamp } from 'firebase/firestore';
import { IPlannedExercise } from '../workoutplanner';

export enum WorkoutStatus {
  PLANNED = 'planned',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export interface ISet {
  id?: string;
  weight: number;
  reps: number;
  isCompleted: boolean;
}

export interface IActiveExercise
  extends Omit<IPlannedExercise, 'sets' | 'reps'> {
  sets: ISet[];
  notes?: string;
}

export interface IActiveWorkout {
  id: string;
  originalWorkoutId: string;
  name: string;
  exercises: IActiveExercise[];
  status: WorkoutStatus;
  startTime: Timestamp;
  endTime?: Timestamp;
  duration?: number; // In seconds
  userId: string;
  notes?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface IWorkoutStats {
  totalSets: number;
  totalCompletedSets: number;
  totalReps: number;
  totalWeight: number; // Total volume , reps * weight
  totalExercises: number;
}
