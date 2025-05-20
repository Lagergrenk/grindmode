import { useState, useEffect } from 'react';
import { getPlannedWorkouts } from '../firebase';
import { IPlannedWorkouts, IWorkout } from '../types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon, CheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { StartWorkoutButton } from '@/features/workouttracker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

/**
 * Component for displaying a list of planned workouts
 * Allows users to view, start, and edit their workout plans
 */
export const ViewPlannedWorkouts = () => {
  const [workouts, setWorkouts] = useState<IPlannedWorkouts[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // State for workout selection dialog
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<IPlannedWorkouts | null>(
    null,
  );
  const [selectedWorkout, setSelectedWorkout] = useState<IWorkout | null>(null);

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

  /**
   * Opens the workout selection dialog for a specific workout plan
   * @param workout - The selected workout plan
   */
  const handleStartWorkout = (workout: IPlannedWorkouts) => {
    setSelectedPlan(workout);
    setIsDialogOpen(true);
  };

  /**
   * Handles the selection of a specific workout from the dialog
   * @param workout - The selected workout to start
   */
  const handleSelectWorkout = (workout: IWorkout) => {
    setSelectedWorkout(workout);
  };

  /**
   * Closes the dialog and resets selection state
   */
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedWorkout(null);
    // We keep the selectedPlan to avoid UI flicker if dialog is reopened
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
          <Button onClick={() => navigate('/workoutplanner')}>
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
                    onClick={() => handleStartWorkout(workout)}
                    className="flex-1"
                  >
                    Start workout
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Workout Selection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select a Workout</DialogTitle>
            <DialogDescription>
              Choose which workout you would like to start from{' '}
              {selectedPlan?.name || 'this plan'}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Command>
              <CommandInput placeholder="Search workouts..." />
              <CommandList>
                <CommandEmpty>No workouts found.</CommandEmpty>
                <CommandGroup>
                  {selectedPlan?.workouts.map((workout) => (
                    <CommandItem
                      key={workout.id}
                      value={workout.name}
                      onSelect={() => handleSelectWorkout(workout)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <p>{workout.name}</p>
                        {workout.exercises && (
                          <p className="text-sm text-muted-foreground">
                            {workout.exercises.length} exercise
                            {workout.exercises.length !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                      {selectedWorkout?.id === workout.id && (
                        <CheckIcon className="h-4 w-4" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <StartWorkoutButton
              workoutId={selectedWorkout?.id || ''}
              plannedWorkoutsId={selectedPlan?.id || ''}
              disabled={!selectedWorkout}
            >
              Start Workout
            </StartWorkoutButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
