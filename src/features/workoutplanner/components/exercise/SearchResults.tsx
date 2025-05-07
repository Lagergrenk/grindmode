import { Button } from '@/components/ui/button';
import { IExerciseDefinition } from '../../types';
import { ExerciseItem } from './ExerciseItem';

interface ISearchResultsProps {
  searchResults: IExerciseDefinition[];
  onSelectExercise: (exercise: IExerciseDefinition) => void;
  onViewExercise?: (exerciseId: string) => void;
  className?: string;
}

export const SearchResults: React.FC<ISearchResultsProps> = ({
  searchResults,
  onSelectExercise,
  onViewExercise,
}) => {
  return (
    <div className="space-y-2">
      {searchResults.map((exercise) => (
        <div key={exercise.id} className="relative">
          <ExerciseItem
            id={exercise.id || `${exercise.name}-${Math.random()}`}
            exercise={exercise}
            onView={onViewExercise}
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 bottom-2"
            onClick={() => onSelectExercise(exercise)}
          >
            Add
          </Button>
        </div>
      ))}
    </div>
  );
};
