import { useContext } from 'react';
import { AppContext } from '@/context/app.context';

/**
 * Custom hook to access the global application state
 * @returns The app context value containing state and update functions
 */
export const useAppState = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppState must be used within an AppProvider');
  }

  const {
    state,
    setHeightUnit,
    setWeightUnit,
    setDateFormat,
    setSidebarOpen,
    setTheme,

    setWorkoutDaysPerWeek,
  } = context;

  return {
    state,
    setHeightUnit,
    setWeightUnit,
    setDateFormat,
    setSidebarOpen,
    setTheme,
    setWorkoutDaysPerWeek,
  };
};
