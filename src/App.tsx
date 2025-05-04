import React from 'react';
import { AuthProvider } from './providers/auth.provider';
import { Routes } from './routes';
import { AppProvider } from './providers/app.provider';
import './index.css';
import { ThemeProvider } from './providers/theme.provider';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppProvider>
          <Routes />
        </AppProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
