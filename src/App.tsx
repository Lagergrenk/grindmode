import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
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
          <Router>
            <Routes />
          </Router>
        </AppProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
