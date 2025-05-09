import { Button } from '@/components/ui/button';
import { IExerciseSearchResultItem } from '../../types';
import { Info } from 'lucide-react';

interface ISearchResultsProps {
  searchResults: IExerciseSearchResultItem[];
  onSelectExercise: (exerciseId: string) => void;
  onViewExercise?: (exerciseId: string) => void;
  className?: string;
}

export const SearchResults: React.FC<ISearchResultsProps> = ({
  searchResults,
  onViewExercise,
  onSelectExercise,
}) => {
  return (
    <div className="space-y-2">
      {searchResults.map((exercise) => (
        <div
          key={exercise.exerciseId}
          className="flex justify-between items-center p-4 border rounded-md bg-card text-card-foreground"
        >
          <p className="text-sm text-muted-foreground mb-1">{exercise.name}</p>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onViewExercise?.(exercise.exerciseId)}
            >
              <Info className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectExercise(exercise.exerciseId)}
            >
              Add
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
