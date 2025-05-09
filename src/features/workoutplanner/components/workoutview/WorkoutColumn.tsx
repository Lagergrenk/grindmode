import { Info, Trash2 } from 'lucide-react';
import { Button } from '@components/ui/button';

import { IPlannedExercise, IWorkout } from '../../types';

interface IWorkoutColumnProps {
  children: React.ReactNode;
  plannedExercise: IPlannedExercise;
  workout: IWorkout;
  removeExerciseFromWorkout: (workoutId: string, exerciseId: string) => void;
  handleViewExerciseDetails: (exerciseId: string) => void;
}

export const WorkoutColumn: React.FC<IWorkoutColumnProps> = ({
  children,
  plannedExercise,
  workout,
  removeExerciseFromWorkout,
  handleViewExerciseDetails,
}) => {
  return (
    <div key={plannedExercise.exerciseId} className="border-t pt-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">{plannedExercise.name}</h4>
        <div>
          <div className="flex flex-row">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                handleViewExerciseDetails(plannedExercise.exerciseId)
              }
              aria-label={`View details for ${plannedExercise.name}`}
            >
              <Info className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                removeExerciseFromWorkout(
                  workout.id,
                  plannedExercise.exerciseId,
                )
              }
              aria-label={`Remove ${plannedExercise.name} from workout`}
            >
              <Trash2 className="h-4 w-4 text-red-400" />
            </Button>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};
