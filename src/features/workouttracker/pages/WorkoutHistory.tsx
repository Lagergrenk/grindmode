// Src/features/workouttracker/pages/WorkoutHistoryPage.tsx
import { useState, useEffect } from 'react';
import { getUserWorkouts } from '../firebase';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { IActiveWorkout } from '../types';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon, BarChart2 } from 'lucide-react';
import { formatDuration } from '@/shared/utils/formatTime';
import { useNavigate } from 'react-router-dom';

/**
 * Page component for displaying workout history
 */
export const WorkoutHistoryPage = () => {
  const [workouts, setWorkouts] = useState<IActiveWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const fetchedWorkouts = await getUserWorkouts();
        setWorkouts(fetchedWorkouts);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError('Failed to load workout history');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [user]);

  const handleViewWorkout = (workoutId: string) => {
    navigate(`/workout/summary/${workoutId}`);
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Workout History</h1>
      </div>

      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {!loading && workouts.length === 0 && (
        <Card className="text-center p-8">
          <h2 className="text-2xl font-medium mb-2">No Workouts Yet</h2>
          <p className="text-muted-foreground mb-6">
            You haven't completed any workouts yet. Get started by selecting a
            workout plan.
          </p>
          <Button onClick={() => navigate('/workouts')}>
            View Workout Plans
          </Button>
        </Card>
      )}

      <div className="space-y-4">
        {!loading &&
          workouts.map((workout) => (
            <Card key={workout.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{workout.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <CalendarIcon className="h-4 w-4" />
                      {workout.startTime &&
                        format(workout.startTime.toDate(), 'PPP')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      Exercises
                    </span>
                    <span className="font-medium">
                      {workout.exercises.length}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Sets</span>
                    <span className="font-medium">
                      {workout.exercises.reduce(
                        (total, ex) =>
                          total + ex.sets.filter((s) => s.isCompleted).length,
                        0,
                      )}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      Duration
                    </span>
                    <span className="font-medium">
                      {formatDuration(workout.duration || 0)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Time</span>
                    <span className="font-medium">
                      {workout.startTime &&
                        format(workout.startTime.toDate(), 'p')}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => handleViewWorkout(workout.id)}
                  className="w-full"
                >
                  <BarChart2 className="h-4 w-4 mr-2" /> View Details
                </Button>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};
