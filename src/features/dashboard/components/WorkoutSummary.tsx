import React from 'react';
import { PlusCircle, ArrowRight } from 'lucide-react';
import { SummaryCard } from '@/components/ui/SummaryCard';
import { StatItem } from '@/components/ui/stats/StatItem';
import { StatRow } from '@/components/ui/stats/StatRow';
import { DataEntry } from '@/components/ui/stats/DataEntry';
import { IActiveWorkout } from '@/features/workouttracker/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

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
    recentWorkouts: IActiveWorkout[];
  };
  isLoading?: boolean;
  error?: string | null;
  onLogWorkout: () => void;
  onViewHistory: () => void;
}

/**
 * Displays a summary of the user's workout activity
 * Shows weekly stats and today's workout status
 */
export const WorkoutSummary: React.FC<IWorkoutSummaryProps> = ({
  workoutData = {
    today: { completed: false, duration: 0, exercises: 0 },
    weekly: { workouts: 0, totalDuration: 0 },
    recentWorkouts: [],
  },
  isLoading = false,

  onLogWorkout,
  onViewHistory,
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

      {/* Recent workouts section */}
      {workoutData.recentWorkouts.length > 0 && (
        <div className="pt-2">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-muted-foreground">Recent Workouts</p>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto"
              onClick={onViewHistory}
            >
              <span className="text-xs flex items-center">
                View all <ArrowRight className="h-3 w-3 ml-1" />
              </span>
            </Button>
          </div>

          {workoutData.recentWorkouts.map((workout) => (
            <div
              key={workout.id}
              className="border-b border-border pb-2 last:border-0 mb-2 last:mb-0"
            >
              <p className="text-sm font-medium">{workout.name}</p>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {workout.endTime
                    ? format(workout.endTime.toDate(), 'MMM d')
                    : 'Date unknown'}
                </span>
                <span>
                  {workout.exercises.length} exercise
                  {workout.exercises.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </SummaryCard>
);
