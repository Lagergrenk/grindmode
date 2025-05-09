import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IExerciseSearchResultItem } from '../../types';

interface IExerciseSelectionDialogProps {
  title: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: IExerciseSearchResultItem) => void;
  onViewExercise: (exercise: IExerciseSearchResultItem) => void;
  children?: React.ReactNode;
}

/**
 * Dialog component for selecting exercises to add to a workout day
 */
export const SelectionDialog: React.FC<IExerciseSelectionDialogProps> = ({
  title,
  isOpen,
  onClose,
  children,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Exercise to {title}</DialogTitle>
          <DialogDescription>
            Search and select an exercise to add to your workout.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 h-96">{children}</div>
      </DialogContent>
    </Dialog>
  );
};
