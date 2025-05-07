import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  IExerciseDefinition,
  IScheduledExercise,
} from '@/features/workoutplanner/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Edit, Save, X } from 'lucide-react';

interface IExerciseDetailDialogProps {
  exercise: IExerciseDefinition | IScheduledExercise | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (exercise: IScheduledExercise) => void;
  mode?: 'view' | 'edit';
}

/**
 * Dialog component that displays and allows editing exercise details
 */
export const DetailsDialog: React.FC<IExerciseDetailDialogProps> = ({
  exercise,
  isOpen,
  onClose,
  onSave,
  mode = 'view',
}) => {
  const [editMode, setEditMode] = useState<boolean>(mode === 'edit');
  const [editedExercise, setEditedExercise] = useState<
    Partial<IScheduledExercise>
  >({});

  // Reset the form when a new exercise is loaded or dialog opens
  React.useEffect(() => {
    if (exercise && isOpen) {
      setEditedExercise({ ...exercise });
      setEditMode(mode === 'edit');
    }
  }, [exercise, isOpen, mode]);

  if (!exercise) return null;

  const isScheduledExercise = 'sets' in exercise;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditedExercise((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (onSave && isScheduledExercise) {
      onSave({
        ...(exercise as IScheduledExercise),
        ...editedExercise,
      });
    }
    setEditMode(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editMode ? 'Edit Exercise' : exercise.name}
          </DialogTitle>
          {!editMode && (
            <DialogDescription>
              {exercise.muscleGroup} - {exercise.equipment}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {!editMode ? (
            <>
              {exercise.imageUrl && (
                <div className="flex justify-center">
                  <img
                    src={exercise.imageUrl}
                    alt={exercise.name}
                    className="max-h-60 rounded-md"
                  />
                </div>
              )}

              {isScheduledExercise && (
                <Card className="p-4">
                  <h3 className="font-medium mb-2">Workout Details:</h3>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="font-medium">Sets</p>
                      <p>{exercise.sets}</p>
                    </div>
                    <div>
                      <p className="font-medium">Reps</p>
                      <p>{exercise.reps}</p>
                    </div>
                    <div>
                      <p className="font-medium">Weight</p>
                      <p>{exercise.weight || 'N/A'}</p>
                    </div>
                  </div>
                  {(exercise as IScheduledExercise).notes && (
                    <div className="mt-2">
                      <p className="font-medium">Notes:</p>
                      <p className="text-sm text-muted-foreground">
                        {exercise.notes}
                      </p>
                    </div>
                  )}
                </Card>
              )}

              {exercise.instructions && exercise.instructions.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Instructions:</h3>
                  {exercise.instructions.map((instruction, index) => (
                    <p
                      key={index}
                      className="text-sm text-muted-foreground mb-1"
                    >
                      {instruction}
                    </p>
                  ))}
                </div>
              )}
            </>
          ) : (
            isScheduledExercise && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sets">Sets</Label>
                  <Input
                    id="sets"
                    name="sets"
                    type="number"
                    value={editedExercise.sets || exercise.sets}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="reps">Reps</Label>
                  <Input
                    id="reps"
                    name="reps"
                    type="number"
                    value={editedExercise.reps || exercise.reps}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="weight">Weight (optional)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    value={editedExercise.weight || exercise.weight || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={editedExercise.notes || exercise.notes || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )
          )}
        </div>

        <DialogFooter className="flex justify-between">
          {!editMode && isScheduledExercise && onSave && (
            <Button
              variant="outline"
              onClick={() => setEditMode(true)}
              size="sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}

          {editMode ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setEditMode(false)}
                size="sm"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          ) : (
            <Button onClick={onClose} size="sm">
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
