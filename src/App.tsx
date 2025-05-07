import React from 'react';
import { AuthProvider } from './features/auth/provider/authProvider';
import { Routes } from './routes';
import { AppProvider } from './providers/app.provider';
import './index.css';
import { ThemeProvider } from './providers/theme.provider';
import { Toaster } from 'sonner';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppProvider>
          <Routes />
          <Toaster />
        </AppProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
