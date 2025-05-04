import React, { useState, useEffect } from 'react';
import { AppContext } from '@/context/app.context';
import { IAppState, defaultAppState } from '@/types/app.types';
import { useAuth } from '@/hooks/useAuth';

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

  const setMeasurementSystem = (system: 'metric' | 'imperial') => {
    setState((prev) => ({
      ...prev,
      userPreferences: {
        ...prev.userPreferences,
        measeurementSystem: system,
      },
    }));
  };

  const toggleNotifications = () => {
    setState((prev) => ({
      ...prev,
      userPreferences: {
        ...prev.userPreferences,
        notificationsEnabled: !prev.userPreferences.notificationsEnabled,
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

  const setActiveDashboardTab = (tab: string) => {
    setState((prev) => ({
      ...prev,
      ui: {
        ...prev.ui,
        activeDashboardTab: tab,
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

  const value = {
    state,
    setTheme,
    toggleNotifications,
    setSidebarOpen,
    setActiveDashboardTab,
    setMeasurementSystem,
    markDashboardNeedsRefresh,
    resetDashboardRefreshState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
