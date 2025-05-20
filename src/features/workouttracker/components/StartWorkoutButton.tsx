import { Button, IButtonProps } from '@/components/ui/button';
import { PlayCircle, Loader2 } from 'lucide-react';
import { useWorkoutStart } from '../hooks/useWorkoutStart';

interface IStartWorkoutButtonProps extends IButtonProps {
  workoutId: string;
  plannedWorkoutsId: string;
}

/**
 * Button component to start a workout from a planned workout.
 */
export const StartWorkoutButton = ({
  workoutId,
  plannedWorkoutsId,
  ...props
}: IStartWorkoutButtonProps) => {
  const { loading, startWorkoutFromPlan } = useWorkoutStart();

  const handleClick = async () => {
    await startWorkoutFromPlan(workoutId, plannedWorkoutsId);
  };

  return (
    <Button onClick={handleClick} disabled={loading} {...props}>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <PlayCircle className="h-4 w-4 mr-2" />
      )}
      Start Workout
    </Button>
  );
};
