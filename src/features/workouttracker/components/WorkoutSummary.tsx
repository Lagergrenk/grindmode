import { format } from 'date-fns';
import { useActiveWorkout } from '../hooks/useActiveWorkout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDuration } from '@/shared/utils/formatTime';
import { useNavigate } from 'react-router-dom';

interface IWorkoutSummaryProps {
  workoutId: string;
}

/**
 * Displays a summary of a completed workout with statistics and details
 */
export const WorkoutSummary = ({ workoutId }: IWorkoutSummaryProps) => {
  const { workout, loading, error, calculateStats } =
    useActiveWorkout(workoutId);
  const navigate = useNavigate();

  // Calculate workout stats
  const stats = calculateStats();

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <p>Error: {error || 'Workout not found'}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate('/workouts')}
        >
          View All Workouts
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Workout Complete!</h1>

      <Card>
        <CardHeader>
          <CardTitle>{workout.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="text-center p-4 bg-muted rounded-md">
              <p className="text-2xl font-bold">{stats.totalExercises}</p>
              <p className="text-sm text-muted-foreground">Exercises</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-md">
              <p className="text-2xl font-bold">{stats.totalCompletedSets}</p>
              <p className="text-sm text-muted-foreground">Sets</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-md">
              <p className="text-2xl font-bold">{stats.totalReps}</p>
              <p className="text-sm text-muted-foreground">Reps</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-md">
              <p className="text-2xl font-bold">{stats.totalWeight}kg</p>
              <p className="text-sm text-muted-foreground">Volume</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Duration</span>
              <span>{formatDuration(workout.duration || 0)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Started</span>
              <span>
                {workout.startTime
                  ? format(workout.startTime.toDate(), 'PPp')
                  : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Completed</span>
              <span>
                {workout.endTime
                  ? format(workout.endTime.toDate(), 'PPp')
                  : 'N/A'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mt-6">Exercise Details</h2>

      <div className="space-y-4">
        {workout.exercises.map((exercise, index) => (
          <Card key={exercise.exerciseId || index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{exercise.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="text-left">Set</th>
                    <th className="text-left">Weight</th>
                    <th className="text-left">Reps</th>
                  </tr>
                </thead>
                <tbody>
                  {exercise.sets
                    .filter((set) => set.isCompleted)
                    .map((set, setIndex) => (
                      <tr key={setIndex}>
                        <td>{setIndex + 1}</td>
                        <td>{set.weight}kg</td>
                        <td>{set.reps}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {exercise.sets.filter((set) => set.isCompleted).length === 0 && (
                <p className="text-center text-muted-foreground py-2">
                  No sets completed
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4 justify-center pt-4">
        <Button onClick={() => navigate('/workouts')}>View All Workouts</Button>
        <Button variant="outline" onClick={() => navigate('/')}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};
