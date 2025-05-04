export interface IUserPreference {
  theme: 'light' | 'dark' | 'system';
  measeurementSystem: 'metric' | 'imperial';
  notificationsEnabled: boolean;
}

export interface IUIState {
  sidebarOpen: boolean;
  activeDashboardTab: string;
}

export interface IAppState {
  userPreferences: IUserPreference;
  ui: IUIState;
  dashboardData: {
    needsRefresh: boolean;
    lastUpdated: Date | null;
  };
}

export interface IAppContext {
  state: IAppState;
  setActiveDashboardTab: (tab: string) => void;
  setMeasurementSystem: (system: 'metric' | 'imperial') => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleNotifications: () => void;
}

export const defaultAppState: IAppState = {
  userPreferences: {
    theme: 'light',
    measeurementSystem: 'metric',
    notificationsEnabled: true,
  },
  ui: {
    sidebarOpen: false,
    activeDashboardTab: 'home',
  },
  dashboardData: {
    needsRefresh: false,
    lastUpdated: null,
  },
};
