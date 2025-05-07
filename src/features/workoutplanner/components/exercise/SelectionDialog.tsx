import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IExerciseDefinition, IScheduledExercise } from '../../types';

interface IExerciseSelectionDialogProps {
  dayName: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: IExerciseDefinition) => void;
  onViewExercise: (exercise: IExerciseDefinition | IScheduledExercise) => void;
  children?: React.ReactNode;
}

/**
 * Dialog component for selecting exercises to add to a workout day
 */
export const SelectionDialog: React.FC<IExerciseSelectionDialogProps> = ({
  dayName,
  isOpen,
  onClose,
  children,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Exercise to {dayName}</DialogTitle>
          <DialogDescription>
            Search and select an exercise to add to your workout.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 h-96">{children}</div>
      </DialogContent>
    </Dialog>
  );
};
