import React from 'react';
import {
  Navigate,
  Route,
  Routes as Switch,
  useLocation,
  Link,
} from 'react-router-dom';
import { AuthLayout, DashboardLayout } from '@layouts';
import { ProtectedRoute } from '@/components/navigation/ProtectedRoute';
import { Signup, Login } from '@pages/auth';
import { Settings } from '@pages/dashboard';
import { useAuth } from '@hooks/useAuth';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Nutrition } from './pages/dashboard/Nutrition';

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
          <Route path="settings" element={<Settings />} />
          <Route path="nutrition" element={<Nutrition />} />
          <Route path="workouts" element={<></>} />
          <Route path="progress" element={<></>} />
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
