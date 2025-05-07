import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IExerciseDefinition, IScheduledExercise } from '../../types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Props for the ExerciseItem component
 */
interface IExerciseItemProps {
  exercise: IExerciseDefinition | IScheduledExercise;
  onView?: (exercise: IExerciseDefinition | IScheduledExercise) => void;
  onEdit?: (exercise: IExerciseDefinition | IScheduledExercise) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (exercise: IExerciseDefinition | IScheduledExercise) => void;
  className?: string;
  id?: string;
}

/**
 * Exercise item component for displaying exercises in workout planner
 * Supports contextual actions and different states
 */
export const ExerciseItem: React.FC<IExerciseItemProps> = ({
  exercise,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  className,
  id,
}) => {
  return (
    <Card
      id={id}
      className={cn('relative hover:shadow-md transition-all', className)}
    >
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-1">
          <div>
            <h3 className="font-medium text-sm line-clamp-1">
              {exercise.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {exercise.muscleGroup}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreVertical size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(exercise)}>
                  <Info className="mr-2 h-4 w-4" />
                  View details
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(exercise)}>
                  Edit
                </DropdownMenuItem>
              )}
              {onDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(exercise)}>
                  Duplicate
                </DropdownMenuItem>
              )}
              {onDelete && exercise.id && (
                <DropdownMenuItem
                  onClick={() => onDelete(exercise.id!)}
                  className="text-destructive"
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {exercise.equipment && (
          <Badge variant="outline" className="text-xs mt-1">
            {exercise.equipment}
          </Badge>
        )}

        {exercise.notes && (
          <p className="text-xs text-muted-foreground mt-2 italic line-clamp-2">
            {exercise.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
