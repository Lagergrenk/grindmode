import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ExerciseItem } from '../exercise/ExerciseItem';
import {
  IScheduledExercise,
  IWorkoutDay,
} from '@/features/workoutplanner/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

/**
 * Props for the WorkoutDayColumn component
 */
interface IWorkoutDayColumnProps {
  day: IWorkoutDay;
  isToday?: boolean;
  isActive?: boolean;
  onAddExercise?: (dayName: string) => void;
  onEditExercise?: (exercise: IScheduledExercise) => void;
  onViewExercise?: (exercise: IScheduledExercise) => void;
  onDeleteExercise?: (exerciseId: string, dayName: string) => void;
  onDuplicateExercise?: (exercise: IScheduledExercise, dayName: string) => void;
  className?: string;
  id?: string;
}

/**
 * Represents a single day column in the workout planner
 * Displays exercises scheduled for a specific day and provides actions
 */
export const WorkoutDayColumn: React.FC<IWorkoutDayColumnProps> = ({
  day,
  isToday = false,
  isActive = false,
  onAddExercise,
  onEditExercise,
  onViewExercise,
  onDeleteExercise,
  onDuplicateExercise,
  className,
  id,
}) => {
  const dayId = id || `day-${day.dayName}`;

  /**
   * Returns the appropriate header class based on day status
   */
  const getHeaderClass = () => {
    if (isToday) {
      return 'bg-primary text-primary-foreground';
    }
    if (day.isRecommendedWorkoutDay) {
      return 'bg-accent text-accent-foreground';
    }
    return '';
  };

  /**
   * Calculates the total exercise count for the day
   */
  const exerciseCount = day.exercises.length;

  /**
   * Returns a simplified summary of the day's workout
   */
  const getWorkoutSummary = () => {
    if (exerciseCount === 0) {
      return 'No exercises scheduled';
    }

    // Get primary muscle group (if multiple exercises share the same muscle group)
    const muscleGroups = day.exercises
      .map((exercise) => exercise.muscleGroup)
      .filter(Boolean) as string[];

    if (muscleGroups.length === 0) {
      return `${exerciseCount} exercise${exerciseCount !== 1 ? 's' : ''}`;
    }

    // Find most common muscle group
    const primaryMuscleGroup = muscleGroups.sort(
      (a, b) =>
        muscleGroups.filter((g) => g === b).length -
        muscleGroups.filter((g) => g === a).length,
    )[0];

    return `${primaryMuscleGroup} (${exerciseCount})`;
  };

  return (
    <Card
      className={cn(
        'h-full flex flex-col transition-all',
        isActive && 'ring-2 ring-primary ring-offset-2',
        className,
      )}
      data-day-name={day.dayName}
      id={dayId}
    >
      <CardHeader className={cn('py-3 px-3', getHeaderClass())}>
        <CardTitle className="text-base flex justify-between items-center">
          <div>
            <span>{day.dayName}</span>
            {day.date && (
              <span className="ml-2 text-xs opacity-70">
                {format(day.date, 'MMM d')}
              </span>
            )}
          </div>
          <Button
            variant={isToday ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => onAddExercise?.(day.dayName)}
            title="Add exercise"
          >
            <Plus size={16} />
          </Button>
        </CardTitle>
      </CardHeader>

      {exerciseCount === 0 ? (
        <div className="flex-1 flex items-center justify-center p-4 text-sm text-muted-foreground">
          <p className="text-center">No exercises scheduled</p>
        </div>
      ) : (
        <CardContent className="flex-1 p-2 overflow-y-auto ">
          <div className="space-y-2">
            {day.exercises.map((exercise) => (
              <ExerciseItem
                key={exercise.id || `${exercise.name}-${Math.random()}`}
                exercise={exercise}
                id={`exercise-${exercise.id}-${day.dayName}`}
                onEdit={
                  onEditExercise ? () => onEditExercise(exercise) : undefined
                }
                onView={
                  onViewExercise ? () => onViewExercise(exercise) : undefined
                }
                onDelete={
                  onDeleteExercise && exercise.id
                    ? () => onDeleteExercise(exercise.id!, day.dayName)
                    : undefined
                }
                onDuplicate={
                  onDuplicateExercise
                    ? () => onDuplicateExercise(exercise, day.dayName)
                    : undefined
                }
              />
            ))}
          </div>
        </CardContent>
      )}

      <div className="p-2 border-t text-xs text-center text-muted-foreground">
        {getWorkoutSummary()}
      </div>
    </Card>
  );
};
