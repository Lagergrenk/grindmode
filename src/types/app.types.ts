export interface IUserPreference {
  theme: 'light' | 'dark' | 'system';
  heightUnit: 'cm' | 'ft';
  weightUnit: 'kg' | 'lb';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  notificationsEnabled: boolean;
  workoutDaysPerWeek: number;
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
  setHeightUnit: (unit: 'cm' | 'ft') => void;
  setWeightUnit: (unit: 'kg' | 'lb') => void;
  setDateFormat: (format: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD') => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setWorkoutDaysPerWeek: (days: number) => void;
}

export const defaultAppState: IAppState = {
  userPreferences: {
    theme: 'light',
    heightUnit: 'cm',
    weightUnit: 'kg',
    dateFormat: 'DD/MM/YYYY',
    notificationsEnabled: true,
    workoutDaysPerWeek: 3,
  },
  ui: {
    sidebarOpen: true,
    activeDashboardTab: 'home',
  },
  dashboardData: {
    needsRefresh: false,
    lastUpdated: null,
  },
};
