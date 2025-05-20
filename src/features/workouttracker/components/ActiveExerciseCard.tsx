import { useState } from 'react';
import { IActiveExercise, ISet } from '../types';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
} from '@/components/ui/';
import { ChevronUp, ChevronDown, PlusCircle } from 'lucide-react';

interface IActiveExerciseCardProps {
  exercise: IActiveExercise;
  exerciseIndex: number;
  onUpdateSet: (
    exerciseIndex: number,
    setIndex: number,
    data: Partial<ISet>,
  ) => void;
  onAddSet: (exerciseIndex: number) => void;
}

export const ActiveExerciseCard: React.FC<IActiveExerciseCardProps> = ({
  exercise,
  exerciseIndex,
  onUpdateSet,
  onAddSet,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{exercise.name}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="h-8 w-8 p-0"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground">
              <div className="col-span-1">Set</div>
              <div className="col-span-4">Weight (kg)</div>
              <div className="col-span-4">Reps</div>
              <div className="col-span-3">Done</div>
            </div>

            {exercise.sets.map((set, setIndex) => (
              <div key={setIndex} className="grid grid-cols-12 items-center">
                <div className="col-span-1">{setIndex + 1}</div>
                <div className="col-span-4">
                  <Input
                    type="number"
                    value={set.weight}
                    onChange={(e) =>
                      onUpdateSet(exerciseIndex, setIndex, {
                        weight: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="h-8"
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    type="number"
                    value={set.reps}
                    onChange={(e) =>
                      onUpdateSet(exerciseIndex, setIndex, {
                        reps: parseInt(e.target.value) || 0,
                      })
                    }
                    className="h-8"
                  />
                </div>
                <div className="col-span-3 flex justify-center">
                  <Checkbox
                    checked={set.isCompleted}
                    onCheckedChange={(checked) =>
                      onUpdateSet(exerciseIndex, setIndex, {
                        isCompleted: checked === true,
                      })
                    }
                  />
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddSet(exerciseIndex)}
              className="w-full mt-2"
            >
              <PlusCircle size={16} className="mr-1" /> Add Set
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
