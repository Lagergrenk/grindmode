import React, { useState, useEffect } from 'react';
import { AppContext } from '@/context/app.context';
import { IAppState, defaultAppState } from '@/types/app.types';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<IAppState>(() => {
    // Try to load state from localStorage
    const savedState = localStorage.getItem('appState');
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (e) {
        console.error('Failed to parse saved app state', e);
      }
    }
    return defaultAppState;
  });

  const { user } = useAuth();

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('appState', JSON.stringify(state));
  }, [state]);

  // Reset state when user logs out
  useEffect(() => {
    if (!user) {
      setState((prev) => ({
        ...prev,
        ui: defaultAppState.ui,
        dashboardData: defaultAppState.dashboardData,
      }));
    }
  }, [user]);

  // Action handlers
  const setTheme = (theme: 'light' | 'dark') => {
    setState((prev) => ({
      ...prev,
      userPreferences: {
        ...prev.userPreferences,
        theme,
      },
    }));
  };

  const setHeightUnit = (heightUnit: 'cm' | 'ft') => {
    setState((prev) => ({
      ...prev,
      userPreferences: {
        ...prev.userPreferences,
        heightUnit,
      },
    }));
  };

  const setWeightUnit = (weightUnit: 'kg' | 'lb') => {
    setState((prev) => ({
      ...prev,
      userPreferences: {
        ...prev.userPreferences,
        weightUnit,
      },
    }));
  };

  const setDateFormat = (
    format: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD',
  ) => {
    setState((prev) => ({
      ...prev,
      userPreferences: {
        ...prev.userPreferences,
        dateFormat: format,
      },
    }));
  };

  const setSidebarOpen = (isOpen: boolean) => {
    setState((prev) => ({
      ...prev,
      ui: {
        ...prev.ui,
        sidebarOpen: isOpen,
      },
    }));
  };

  const markDashboardNeedsRefresh = () => {
    setState((prev) => ({
      ...prev,
      dashboardData: {
        ...prev.dashboardData,
        needsRefresh: true,
      },
    }));
  };

  const resetDashboardRefreshState = () => {
    setState((prev) => ({
      ...prev,
      dashboardData: {
        needsRefresh: false,
        lastUpdated: new Date(),
      },
    }));
  };

  const setWorkoutDaysPerWeek = (days: number) => {
    setState((prev) => ({
      ...prev,
      userPreferences: {
        ...prev.userPreferences,
        workoutDaysPerWeek: days,
      },
    }));
  };

  const value = {
    state,
    setTheme,
    setSidebarOpen,
    setHeightUnit,
    setWeightUnit,
    setDateFormat,
    markDashboardNeedsRefresh,
    resetDashboardRefreshState,
    setWorkoutDaysPerWeek,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
