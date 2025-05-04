import { Theme } from '@/providers/theme.provider';
import { createContext, useContext } from 'react';

interface IThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}
const initialState: IThemeProviderState = {
  theme: 'light',
  setTheme: () => null,
};

export const ThemeProviderContext =
  createContext<IThemeProviderState>(initialState);

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
