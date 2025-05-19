import { useState, useEffect } from 'react';
import { getPlannedWorkouts } from '../firebase';
import { IPlannedWorkouts } from '../types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

/**
 * Component for displaying a list of planned workouts
 * Allows users to view, start, and edit their workout plans
 */
export const ViewPlannedWorkouts = () => {
  const [workouts, setWorkouts] = useState<IPlannedWorkouts[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setIsLoading(true);
        const fetchedWorkouts = await getPlannedWorkouts();
        setWorkouts(fetchedWorkouts);
      } catch (err) {
        setError('Failed to fetch planned workouts. Please try again.');
        console.error('Error fetching planned workouts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const handleStartWorkout = (workoutId: string) => {
    navigate(`/workout/start/${workoutId}`);
  };

  const handleEditWorkout = (workoutId: string) => {
    navigate(`/workout/edit/${workoutId}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Planned Workouts</h1>
        <Button onClick={() => navigate('/workoutplanner')}>
          Create New Workout
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="w-full">
              <CardHeader>
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {!isLoading && !error && workouts.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No Planned Workouts</h2>
          <p className="text-gray-600 mb-6">
            You haven't created any workout plans yet.
          </p>
          <Button onClick={() => navigate('/workout/create')}>
            Create Your First Workout Plan
          </Button>
        </div>
      )}

      {!isLoading && workouts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workouts.map((workout) => (
            <Card key={workout.id} className="w-full">
              <CardHeader>
                <CardTitle>{workout.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  {workout.createdAt
                    ? format(workout.createdAt.toDate(), 'PPP')
                    : 'Date unknown'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {workout.workouts && workout.workouts.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Workouts:</p>
                    <div className="flex flex-wrap gap-2">
                      {workout.workouts.slice(0, 3).map((work, i) => (
                        <Badge key={i} variant="secondary">
                          {work.name}
                        </Badge>
                      ))}
                      {workout.workouts.length > 3 && (
                        <Badge variant="outline">
                          +{workout.workouts.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => handleStartWorkout(workout.id)}
                    className="flex-1"
                  >
                    Start
                  </Button>
                  <Button
                    onClick={() => handleEditWorkout(workout.id)}
                    variant="outline"
                    className="flex-1"
                  >
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
