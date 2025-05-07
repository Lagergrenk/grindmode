import React from 'react';
import { Dumbbell, UtensilsCrossed, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IQuickActionsProps {
  onAddWorkout: () => void;
  onLogFood: () => void;
  onRecordMeasurement: () => void;
}

export const QuickActions: React.FC<IQuickActionsProps> = ({
  onAddWorkout,
  onLogFood,
  onRecordMeasurement,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={onAddWorkout}
      >
        <Dumbbell className="h-4 w-4" />
        <span>Add Workout</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={onLogFood}
      >
        <UtensilsCrossed className="h-4 w-4" />
        <span>Log Food</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={onRecordMeasurement}
      >
        <Ruler className="h-4 w-4" />
        <span>Measurements</span>
      </Button>
    </div>
  );
};
