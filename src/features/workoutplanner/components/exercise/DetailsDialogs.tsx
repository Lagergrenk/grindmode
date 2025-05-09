import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IExerciseSearchResultItem } from '@/features/workoutplanner/types';

interface IExerciseDetailDialogProps {
  exercise: IExerciseSearchResultItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (exercise: IExerciseSearchResultItem) => void;
  mode?: 'view' | 'edit';
}

/**
 * Dialog component that displays and allows editing exercise details
 */
export const DetailsDialog: React.FC<IExerciseDetailDialogProps> = ({
  exercise,
  isOpen,
  onClose,
}) => {
  if (!exercise) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{exercise.name}</DialogTitle>

          <DialogDescription>
            {exercise.targetMuscles} - {exercise.equipments}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {exercise.instructions && exercise.instructions.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Instructions:</h3>
              {exercise.instructions.map((instruction, index) => (
                <p key={index} className="text-sm text-muted-foreground mb-1">
                  {instruction}
                </p>
              ))}
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between">
          <Button onClick={onClose} size="sm">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
