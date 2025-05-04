import React from 'react';
import { IAppContext, defaultAppState } from '@/types';

export const AppContext = React.createContext<IAppContext>({
  state: defaultAppState,
  setActiveDashboardTab: () => {},
  setMeasurementSystem: () => {},
  setSidebarOpen: () => {},
  setTheme: () => {},
  toggleNotifications: () => {},
});
