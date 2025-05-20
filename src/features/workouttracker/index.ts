// Src/features/workouttracker/index.ts
// Export components
export { ActiveExerciseCard } from './components/ActiveExerciseCard';
export { WorkoutProgressBar } from './components/ProgressBar';
export { WorkoutTimer } from './components/WorkoutTimer';
export { WorkoutSummary } from './components/WorkoutSummary';
export { StartWorkoutButton } from './components/StartWorkoutButton';

// Export hooks
export { useActiveWorkout } from './hooks/useActiveWorkout';
export { useWorkoutStart } from './hooks/useWorkoutStart';
export { useCompletedWorkoutEntry } from './hooks/useCompletedWorkoutEntry';

// Export pages
export { ActiveWorkoutPage } from './pages/ActiveWorkout';
export { WorkoutSummaryPage } from './pages/WorkoutSummary';
export { WorkoutHistoryPage } from './pages/WorkoutHistory';

// Export types
export type {
  ISet,
  IActiveExercise,
  IActiveWorkout,
  IWorkoutStats,
} from './types';
export { WorkoutStatus } from './types';

// Export Firebase functions
export {
  startWorkout,
  updateActiveWorkout,
  completeWorkout,
  getUserWorkouts,
  getActiveWorkoutById,
} from './firebase';
