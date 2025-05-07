import { ThemeProviderContext } from '@/hooks/useTheme';
import { IAppState } from '@/types';
import { useEffect, useState } from 'react';

export type Theme = 'dark' | 'light' | 'system';

export interface IThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'appState',
  ...props
}: IThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const appStateJson = localStorage.getItem(storageKey);
      if (appStateJson) {
        const appState = JSON.parse(appStateJson) as IAppState;
        return appState?.userPreferences?.theme || defaultTheme;
      }
    } catch (error) {
      console.error('Error reading theme from localStorage:', error);
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      // Update the theme in localStorage within the appState structure
      try {
        const appStateJson = localStorage.getItem(storageKey);
        const appState: IAppState = appStateJson
          ? JSON.parse(appStateJson)
          : {};

        // Ensure we have the proper structure
        if (!appState.userPreferences) {
          appState.userPreferences = {
            heightUnit: 'cm',
            weightUnit: 'kg',
            dateFormat: 'DD/MM/YYYY',
            workoutDaysPerWeek: 3,
            theme: newTheme,

            notificationsEnabled: true,
          };
        }

        // Update the theme
        appState.userPreferences.theme = newTheme;

        // Save back to localStorage
        localStorage.setItem(storageKey, JSON.stringify(appState));

        // Update state
        setTheme(newTheme);
      } catch (error) {
        console.error('Error saving theme to localStorage:', error);
        // Still update the state even if localStorage fails
        setTheme(newTheme);
      }
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
