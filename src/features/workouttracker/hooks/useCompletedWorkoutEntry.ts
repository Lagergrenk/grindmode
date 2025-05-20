import { useState, useEffect } from 'react';
import { getUserWorkouts } from '../firebase';
import { WorkoutStatus, IActiveWorkout } from '../types';
import { addDays, isWithinInterval, startOfWeek } from 'date-fns';

/**
 * Interface for workout summary statistics
 */
interface IWorkoutSummary {
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
}

/**
 * Custom hook for fetching and processing completed workout data
 * @returns Object containing workout data, loading state, and error information
 */
export const useCompletedWorkoutEntry = () => {
  const [completedWorkouts, setCompletedWorkouts] = useState<IActiveWorkout[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [workoutSummary, setWorkoutSummary] = useState<IWorkoutSummary>({
    today: {
      completed: false,
      duration: 0,
      exercises: 0,
    },
    weekly: {
      workouts: 0,
      totalDuration: 0,
    },
    recentWorkouts: [],
  });

  // Fetch completed workouts
  useEffect(() => {
    const fetchCompletedWorkouts = async () => {
      try {
        setIsLoading(true);
        const workouts = await getUserWorkouts(WorkoutStatus.COMPLETED);
        setCompletedWorkouts(workouts);

        // Process workout data once received
        processWorkoutData(workouts);
        setError(null);
      } catch (err) {
        console.error('Error fetching completed workouts:', err);
        setError('Failed to load workout data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompletedWorkouts();
  }, []);

  /**
   * Process raw workout data into summary statistics
   * @param workouts - Array of completed workouts
   */
  const processWorkoutData = (workouts: IActiveWorkout[]) => {
    const now = new Date();
    const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 }); // Week starts on Monday
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = addDays(today, 1);

    // Find today's workouts
    const todayWorkouts = workouts.filter((workout) => {
      const workoutDate = workout.endTime?.toDate();
      return workoutDate && workoutDate >= today && workoutDate < tomorrow;
    });

    // Calculate today's stats
    const todayTotalDuration = todayWorkouts.reduce(
      (total, workout) => total + (workout.duration || 0),
      0,
    );
    const todayTotalExercises = todayWorkouts.reduce(
      (total, workout) => total + workout.exercises.length,
      0,
    );

    // Find this week's workouts
    const weeklyWorkouts = workouts.filter((workout) => {
      const workoutDate = workout.endTime?.toDate();
      return (
        workoutDate &&
        isWithinInterval(workoutDate, {
          start: startOfCurrentWeek,
          end: now,
        })
      );
    });

    // Calculate weekly stats
    const weeklyTotalDuration = weeklyWorkouts.reduce(
      (total, workout) => total + (workout.duration || 0),
      0,
    );

    // Get recent workouts (most recent first)
    const sortedWorkouts = [...workouts].sort((a, b) => {
      const dateA = a.endTime?.toDate()?.getTime() || 0;
      const dateB = b.endTime?.toDate()?.getTime() || 0;
      return dateB - dateA;
    });

    const recentWorkouts = sortedWorkouts.slice(0, 3);

    // Update summary state
    setWorkoutSummary({
      today: {
        completed: todayWorkouts.length > 0,
        duration: Math.round(todayTotalDuration / 60), // Convert seconds to minutes
        exercises: todayTotalExercises,
      },
      weekly: {
        workouts: weeklyWorkouts.length,
        totalDuration: Math.round(weeklyTotalDuration / 60), // Convert seconds to minutes
      },
      recentWorkouts,
    });
  };

  return {
    isLoading,
    error,
    completedWorkouts,
    workoutSummary,
  };
};
