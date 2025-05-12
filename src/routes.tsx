import React from 'react';
import {
  Route,
  Routes as Switch,
  useLocation,
  Link,
  Navigate,
} from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ProtectedRoute } from './components/navigation';
import { Dashboard } from './features/dashboard/pages/Dashboard';
import { DashboardLayout } from '@/shared/layouts/DashboardLayout';
import { Nutrition } from './features/nutrition/pages/Nutrition';
import { WorkoutPlanner } from './features/workoutplanner';
import { Profile } from './features/profile';
import { LandingPage } from './features/landing/pages/LandingPage';
import { AuthLayout } from './features/auth';
import { Login } from './features/auth/pages/Login';
import { Signup } from './features/auth/pages/Signup';

/**
 * Main router component that handles application routing
 * Manages authentication state and protected routes
 */
export const Routes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while auth is being checked
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Switch>
      {/* Auth Routes */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />
        }
      />
      <Route key="auth-layout" element={<AuthLayout />}>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />}
        />
      </Route>

      {/*  Protected Routes with Dashboard Layout*/}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/workoutplanner" element={<WorkoutPlanner />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/progress" element={<div>Progress Tracking</div>} />
        </Route>
      </Route>

      {/* 404 Not Found Route */}
      <Route
        path="*"
        element={
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
            <p className="mb-4">
              The page at {location.pathname} does not exist.
            </p>
            <Link
              to="/"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Return Home
            </Link>
          </div>
        }
      />
    </Switch>
  );
};
