import React from 'react'; // Removed useState as it's not used here
import { IPlannedExercise } from '../../types';
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { EditableText } from '@/components/ui';

/**
 * Props for the ExerciseItem component
 */
interface IExerciseItemProps {
  exercise: IPlannedExercise;
  onAddSet?: (exerciseId: string) => void;
  onDeleteSet?: (exerciseId: string) => void;
  OnSaveReps?: (reps: number | string) => void;
  OnSaveWeight?: (weight: number | string) => void;
  className?: string;
  id?: string;
}

/**
 * Exercise item component for displaying exercises in workout planner.
 * Renders a table of sets with weight and reps, and allows adding new sets.
 */
export const ExerciseItem: React.FC<IExerciseItemProps> = ({
  exercise,
  onAddSet,
  onDeleteSet,
  OnSaveReps,
  OnSaveWeight,
  className,
  id,
}) => {
  const { sets = 0, weight = 0, reps = 0, exerciseId } = exercise;

  return (
    <div
      className={`rounded border p-4 bg-card text-card-foreground ${className ?? ''}`}
      id={id}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4">Set</TableHead>
            <TableHead className="w-1/4">Reps</TableHead>
            <TableHead className="w-1/4">Weight</TableHead>
            <TableHead className="w-1/4 text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: sets }, (_, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <EditableText
                  className="w-16"
                  initialValue={reps}
                  onSave={(newVale) => OnSaveReps && OnSaveReps(newVale)}
                />
              </TableCell>
              <TableCell>
                <EditableText
                  className="w-16"
                  initialValue={weight}
                  onSave={(newVale) => OnSaveWeight && OnSaveWeight(newVale)}
                />
              </TableCell>
              <TableCell className="text-right">
                {sets > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={
                      onDeleteSet ? () => onDeleteSet(exerciseId) : undefined
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={4} className="text-center ">
              <Button
                variant="ghost"
                size="icon"
                onClick={onAddSet ? () => onAddSet(exerciseId) : undefined}
                className="w-full"
              >
                <PlusCircle className="h-full w-3" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
