// Src/features/workouttracker/components/WorkoutProgressBar.tsx
import { Progress } from '@/components/ui';
import { IWorkoutStats } from '../types';

interface IWorkoutProgressBarProps {
  stats: IWorkoutStats;
}

/**
 * Component that displays workout progress as a visual indicator
 */
export const WorkoutProgressBar = ({ stats }: IWorkoutProgressBarProps) => {
  const progressPercentage =
    stats.totalSets > 0
      ? Math.round((stats.totalCompletedSets / stats.totalSets) * 100)
      : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">
          {stats.totalCompletedSets} of {stats.totalSets} sets completed
        </span>
        <span className="text-sm font-medium">{progressPercentage}%</span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
};
