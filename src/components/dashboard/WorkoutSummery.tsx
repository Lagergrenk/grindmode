import React from 'react';
import { PlusCircle } from 'lucide-react';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { StatItem } from '@/components/ui/stats/StatItem';
import { StatRow } from '@/components/ui/stats/StatRow';
import { DataEntry } from '@/components/ui/stats/DataEntry';

interface IWorkoutSummaryProps {
  workoutData?: {
    today: {
      completed: boolean;
      duration: number;
      exercises: number;
    };
    weekly: {
      workouts: number;
      totalDuration: number;
    };
  };
  isLoading?: boolean;
  onLogWorkout: () => void;
}

export const WorkoutSummary: React.FC<IWorkoutSummaryProps> = ({
  workoutData,
  isLoading = false,
  onLogWorkout,
}) => {
  return (
    <SummaryCard
      title="Workouts"
      actionLabel="Log"
      actionIcon={<PlusCircle className="h-4 w-4 mr-1" />}
      onAction={onLogWorkout}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <StatRow>
          <StatItem
            label="This Week"
            value={workoutData?.weekly.workouts || 0}
            unit="workouts"
          />
          <StatItem
            label="Total Time"
            value={workoutData?.weekly.totalDuration || 0}
            unit="min"
            className="text-right"
          />
        </StatRow>

        {workoutData?.today.completed ? (
          <div className="pt-2">
            <p className="text-sm text-muted-foreground mb-2">
              Today's Workout
            </p>
            <DataEntry
              title="Completed"
              subtitle={`${workoutData.today.exercises} exercises`}
              value={workoutData.today.duration}
              unit="min"
            />
          </div>
        ) : (
          <div className="pt-2">
            <DataEntry
              title="No workout yet today"
              subtitle="Log your workout to track progress"
            />
          </div>
        )}
      </div>
    </SummaryCard>
  );
};
