import {
  getNutritionEntriesByDate,
  addNutritionEntry,
  updateNutritionEntry,
  deleteNutritionEntry,
  getNutritionEntries,
  getNutritionSummary,
} from '@/features/nutrition/api';
import { INutritionEntry } from '@/features/nutrition';
import { isToday } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useNutritionEntry = (selectedDate: Date) => {
  const [allNutritionEntries, setAllNutritionEntries] = useState<
    INutritionEntry[]
  >([]);
  const [selectedDateNutritionEntries, setSelectedDateNutritionEntries] =
    useState<INutritionEntry[]>([]);
  const [weeklyNutritionEntries, setWeeklyNutritionEntries] = useState<
    INutritionEntry[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataVersion, setDataVersion] = useState<number>(0);

  const isEntryInCurrentWeek = useCallback(
    (entry: INutritionEntry): boolean => {
      if (!entry.date) return false;

      const today = new Date();
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);

      const entryDate = entry.date.toDate();
      return entryDate >= weekAgo && entryDate <= today;
    },
    [],
  );

  const refreshData = useCallback(
    (updatedEntry?: INutritionEntry) => {
      // If we have an updated entry, update the state immediately
      if (updatedEntry) {
        setSelectedDateNutritionEntries((prev) => {
          // If the entry already exists in the array, replace it
          if (prev.some((entry) => entry.id === updatedEntry.id)) {
            return prev.map((entry) =>
              entry.id === updatedEntry.id ? updatedEntry : entry,
            );
          }
          // Otherwise add it to the array
          else {
            return [updatedEntry, ...prev];
          }
        });

        // Also update the weekly and all entries arrays if needed
        if (isEntryInCurrentWeek(updatedEntry)) {
          setWeeklyNutritionEntries((prev) => {
            if (prev.some((entry) => entry.id === updatedEntry.id)) {
              return prev.map((entry) =>
                entry.id === updatedEntry.id ? updatedEntry : entry,
              );
            } else {
              return [updatedEntry, ...prev];
            }
          });
        }

        setAllNutritionEntries((prev) => {
          if (prev.some((entry) => entry.id === updatedEntry.id)) {
            return prev.map((entry) =>
              entry.id === updatedEntry.id ? updatedEntry : entry,
            );
          } else {
            return [updatedEntry, ...prev];
          }
        });
      }

      // Always trigger a refetch to ensure consistency with server
      setDataVersion((prev) => prev + 1);
    },
    [isEntryInCurrentWeek],
  );

  useEffect(() => {
    const fetchSelectedDateNutritionEntries = async () => {
      setIsLoading(true);
      try {
        const response = await getNutritionEntriesByDate(selectedDate);
        setSelectedDateNutritionEntries(response);
      } catch (error) {
        console.error('Error fetching nutrition entries by date:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSelectedDateNutritionEntries();
  }, [selectedDate]);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      setIsLoading(true);
      try {
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);

        const entries = await getNutritionSummary();
        setWeeklyNutritionEntries(entries);
      } catch (error) {
        console.error('Error fetching weekly nutrition entries:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWeeklyData();
  }, [dataVersion]);

  useEffect(() => {
    const fetchAllNutritionEntries = async () => {
      setIsLoading(true);
      try {
        const entries = await getNutritionEntries();
        setAllNutritionEntries(entries);
      } catch (error) {
        console.error('Error fetching all nutrition entries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllNutritionEntries();
  }, [dataVersion]);

  const getWeeklySummary = useCallback(() => {
    const uniqueDays = new Set();
    weeklyNutritionEntries.forEach((entry) => {
      if (!entry.date) return;

      const entryDate = entry.date.toDate();
      const dateKey = `${entryDate.getFullYear()}-${entryDate.getMonth()}-${entryDate.getDate()}`;
      uniqueDays.add(dateKey);
    });

    const totalCalories = weeklyNutritionEntries.reduce(
      (sum, entry) => sum + (entry.dailyTotals?.calories || 0),
      0,
    );

    const totalProtein = weeklyNutritionEntries.reduce(
      (sum, entry) => sum + (entry.dailyTotals?.protein || 0),
      0,
    );

    const daysTracked = uniqueDays.size;

    const averageCalories = daysTracked > 0 ? totalCalories / daysTracked : 0;
    const averageProtein = daysTracked > 0 ? totalProtein / daysTracked : 0;

    return {
      averageCalories,
      averageProtein,
      daysTracked,
    };
  }, [weeklyNutritionEntries]);

  // Calculate today's nutrition data
  const getTodayData = useCallback(() => {
    // Find today's entry
    const todayEntry = allNutritionEntries.find((entry) => {
      if (!entry.date) return false;
      const entryDate = entry.date.toDate();
      return isToday(entryDate);
    });

    return {
      calories: todayEntry?.dailyTotals?.calories || 0,
      protein: todayEntry?.dailyTotals?.protein || 0,
      meals: todayEntry?.meals?.length || 0,
    };
  }, [allNutritionEntries]);

  // Combined nutrition summary for dashboard
  const nutritionSummary = useMemo(() => {
    const weeklyData = getWeeklySummary();
    const todayData = getTodayData();

    return {
      today: todayData,
      weekly: {
        averageCalories: weeklyData.averageCalories,
        averageProtein: weeklyData.averageProtein,
        daysTracked: weeklyData.daysTracked,
      },
    };
  }, [getWeeklySummary, getTodayData]);

  // Crud operations
  const addEntry = async (entry: Omit<INutritionEntry, 'id'>) => {
    setIsLoading(true);
    try {
      const entryWithDate = {
        ...entry,
        date: entry.date || Timestamp.fromDate(selectedDate),
      };

      const entryId = await addNutritionEntry(entryWithDate);
      if (entryId) {
        // Instead of manually updating the arrays, trigger a reload
        refreshData();
        return entryId;
      }
      return null;
    } catch (error) {
      console.error('Error adding nutrition entry:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateEntry = async (
    id: string,
    updates: Partial<INutritionEntry>,
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await updateNutritionEntry(id, updates);
      if (success) {
        refreshData(); // Trigger reload of data
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating nutrition entry:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEntry = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await deleteNutritionEntry(id);
      if (success) {
        refreshData(); // Trigger reload of data
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting nutrition entry:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateNotes = useCallback(
    async (id: string, notes: string): Promise<boolean> => {
      setIsLoading(true);
      try {
        const success = await updateNutritionEntry(id, { notes });
        if (success) {
          refreshData();
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error updating notes:', error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [refreshData],
  );

  return {
    // State
    isLoading,
    allNutritionEntries,
    weeklyNutritionEntries,
    selectedDateNutritionEntries,
    nutritionSummary,

    //CRUD operations
    addEntry,
    updateEntry,
    deleteEntry,
    updateNotes,

    // Summary
    getWeeklySummary,
    getTodayData,

    refreshData,
  };
};
