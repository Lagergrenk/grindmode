import React from 'react';
import { Navigate, Route, Routes as Switch } from 'react-router-dom';
import { AuthLayout, DashboardLayout } from '@layouts';
import { ProtectedRoute } from '@/components/navigation/ProtectedRoute';
import { Signup, Login } from '@pages/auth';
import { Settings } from '@pages/dashboard';
import { useAuth } from '@hooks/useAuth';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Nutrition } from './pages/dashboard/Nutrition';

export const Routes: React.FC = () => {
  // Your authentication logic
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />}
        />
      </Route>

      {/* Protected Routes*/}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          {/* Use index for the default route */}
          <Route path="settings" element={<Settings />} />
          {/* Use relative paths */}
          <Route path="nutrition" element={<Nutrition />} />
          {/* Update to your component */}
          <Route path="workouts" element={<></>} />
          {/* Update to your component */}
          <Route path="progress" element={<></>} />
          {/* Update to your component */}
        </Route>
      </Route>

      {/* 404 Not Found Route */}
      <Route path="*" element={<div>not found</div>} />
    </Switch>
  );
};
