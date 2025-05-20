import { useParams } from 'react-router-dom';
import { useActiveWorkout } from '../hooks/useActiveWorkout';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { WorkoutTimer } from '../components/WorkoutTimer';
import { ActiveExerciseCard } from '../components/ActiveExerciseCard';
import { WorkoutProgressBar } from '../components/ProgressBar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

/**
 * Page component for an active workout session
 * Shows exercises, sets and allows tracking progress
 */
export const ActiveWorkoutPage = () => {
  const { workoutId } = useParams<{ workoutId: string }>();
  const {
    workout,
    loading,
    error,
    updateSet,
    addSet,
    finishWorkout,
    calculateStats,
  } = useActiveWorkout(workoutId);
  const [isFinishDialogOpen, setIsFinishDialogOpen] = useState(false);

  if (loading) {
    return (
      <div className="container py-8 space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-8 w-1/4" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="container py-8">
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          <p>Error: {error || 'Workout not found'}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">{workout.name}</h1>
          <WorkoutTimer
            startTime={workout.startTime?.toDate()}
            className="text-xl font-mono"
          />
        </div>

        <WorkoutProgressBar stats={stats} />

        <div className="space-y-4">
          {workout.exercises.map((exercise, index) => (
            <ActiveExerciseCard
              key={exercise.exerciseId || index}
              exercise={exercise}
              exerciseIndex={index}
              onUpdateSet={updateSet}
              onAddSet={addSet}
            />
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <AlertDialog
            open={isFinishDialogOpen}
            onOpenChange={setIsFinishDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button size="lg" className="px-8">
                Finish Workout
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Finish Workout</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to finish this workout? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={finishWorkout}>
                  Finish
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};
