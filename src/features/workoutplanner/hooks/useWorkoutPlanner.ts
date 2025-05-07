import { useState, useCallback, useEffect } from 'react';
import { addDays, startOfWeek, isSameDay } from 'date-fns';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAppState } from '@/hooks/useAppState';
import { toast } from 'sonner';
import {
  IWorkoutDay,
  IExerciseDefinition,
  IScheduledExercise,
} from '@/types/workout.types';

/**
 * Custom hook for managing workout planner state and operations
 * Handles loading, manipulating, and storing workout data
 */
export const useWorkoutPlanner = () => {
  const { user } = useAuth();
  const { state } = useAppState();
  const { workoutDaysPerWeek = 3 } = state.userPreferences;
  const [workoutDays, setWorkoutDays] = useState<IWorkoutDay[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [currentDate] = useState<Date>(new Date());

  /**
   * Initializes empty workout days for a week
   * @param startDate - Beginning date of the week to initialize
   */
  const initializeWeekDays = useCallback(
    (startDate: Date): IWorkoutDay[] => {
      const dayNames = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ];

      // Create empty days for the week
      return dayNames.map((dayName, index) => {
        const date = addDays(startDate, index);
        // Mark days as recommended workout days based on user preference
        const isRecommendedWorkoutDay = index < workoutDaysPerWeek;

        return {
          date,
          dayName,
          exercises: [],
          isRecommendedWorkoutDay,
        };
      });
    },
    [workoutDaysPerWeek],
  );

  /**
   * Loads workout data for a specific date range
   * @param startDate - Beginning of date range to fetch
   */
  const loadWorkoutData = useCallback(
    async (startDate: Date) => {
      if (!user) return;

      setIsLoading(true);
      try {
        const days = initializeWeekDays(startDate);
        setWorkoutDays(days);

        // Here you would fetch actual workout data from your backend
        // and merge it with the initialized days
      } catch (error) {
        console.error('Failed to load workout data:', error);
        toast.error('Failed to load workout data');
      } finally {
        setIsLoading(false);
      }
    },
    [user, initializeWeekDays],
  );

  // Initialize the current week
  useEffect(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    setCurrentWeekStart(weekStart);
    loadWorkoutData(weekStart);
  }, [user, loadWorkoutData]);

  /**
   * Handles navigation between weeks
   * @param startDate - First day of the new week
   */
  const handleNavigateWeek = (startDate: Date) => {
    setCurrentWeekStart(startDate);
    loadWorkoutData(startDate);
  };

  /**
   * Handles deleting an exercise from a specific day
   * @param exerciseId - ID of the exercise to delete
   * @param dayName - The day from which to delete the exercise
   */
  const handleDeleteExercise = (exerciseId: string, dayName: string) => {
    try {
      setWorkoutDays((prevDays) =>
        prevDays.map((day) => {
          if (day.dayName === dayName) {
            return {
              ...day,
              exercises: day.exercises.filter((ex) => ex.id !== exerciseId),
            };
          }
          return day;
        }),
      );

      toast('Exercise deleted', {
        description: `Exercise deleted from ${dayName}`,
      });
    } catch (error) {
      console.error('Error deleting exercise:', error);
      toast.error('Failed to delete exercise');
    }
  };

  /**
   * Handles duplicating an exercise on a specific day
   * @param exercise - The exercise to duplicate
   * @param dayName - The day on which to duplicate the exercise
   */
  const handleDuplicateExercise = (
    exercise: IScheduledExercise,
    dayName: string,
  ) => {
    try {
      const duplicatedExercise: IScheduledExercise = {
        ...exercise,
        id: `${exercise.id}-copy-${Date.now()}`,
      };

      setWorkoutDays((prevDays) =>
        prevDays.map((day) => {
          if (day.dayName === dayName) {
            return {
              ...day,
              exercises: [...day.exercises, duplicatedExercise],
            };
          }
          return day;
        }),
      );

      toast('Exercise duplicated', {
        description: `Exercise duplicated on ${dayName}`,
      });
    } catch (error) {
      console.error('Error duplicating exercise:', error);
      toast.error('Failed to duplicate exercise');
    }
  };

  /**
   * Handles adding a selected exercise to the selected day
   * @param exercise - The exercise to add to the day
   * @param dayName - The day to add the exercise to
   */
  const handleAddExerciseToDay = (
    exercise: IExerciseDefinition,
    dayName: string,
  ) => {
    if (!user) return;

    try {
      const scheduledExercise: IScheduledExercise = {
        ...exercise,
        id: `${exercise.id}-${Date.now()}`,
        sets: 3,
        reps: 10,
        weight: 0,
        completed: false,
      };

      setWorkoutDays((prevDays) =>
        prevDays.map((day) => {
          if (day.dayName === dayName) {
            return {
              ...day,
              exercises: [...day.exercises, scheduledExercise],
            };
          }
          return day;
        }),
      );

      toast('Exercise added', {
        description: `${exercise.name} added to ${dayName}`,
      });
    } catch (error) {
      console.error('Error adding exercise:', error);
      toast.error('Failed to add exercise');
    }
  };

  /**
   * Checks if a specific day is today
   * @param date - The date to check
   * @returns True if the date is today
   */
  const isToday = (date: Date): boolean => {
    return isSameDay(date, currentDate);
  };

  return {
    workoutDays,
    isLoading,
    currentWeekStart,
    handleNavigateWeek,
    handleDeleteExercise,
    handleDuplicateExercise,
    handleAddExerciseToDay,
    isToday,
  };
};
