import React from 'react';
import { PlusCircle } from 'lucide-react';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { StatItem } from '@/components/ui/stats/StatItem';
import { StatRow } from '@/components/ui/stats/StatRow';
import { DataEntry } from '@/components/ui/stats/DataEntry';

/**
 * Props interface for the WorkoutSummary component
 */
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

/**
 * Displays a summary of the user's workout activity
 * Shows weekly stats and today's workout status
 */
export const WorkoutSummary: React.FC<IWorkoutSummaryProps> = ({
  workoutData = {
    today: { completed: false, duration: 0, exercises: 0 },
    weekly: { workouts: 0, totalDuration: 0 },
  },
  isLoading = false,
  onLogWorkout,
}) => (
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
          value={workoutData.weekly.workouts}
          unit="workouts"
        />
        <StatItem
          label="Total Time"
          value={workoutData.weekly.totalDuration}
          unit="min"
          className="text-right"
        />
      </StatRow>

      <div className="pt-2">
        {workoutData.today.completed ? (
          <>
            <p className="text-sm text-muted-foreground mb-2">
              Today's Workout
            </p>
            <DataEntry
              title="Completed"
              subtitle={`${workoutData.today.exercises} exercises`}
              value={workoutData.today.duration}
              unit="min"
            />
          </>
        ) : (
          <DataEntry
            title="No workout yet today"
            subtitle="Log your workout to track progress"
          />
        )}
      </div>
    </div>
  </SummaryCard>
);
