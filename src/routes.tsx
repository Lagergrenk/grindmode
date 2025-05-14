import React, { lazy, Suspense } from 'react';
import { Route, Routes as Switch, Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ProtectedRoute } from './components/navigation';
import { DashboardLayout } from '@/shared/layouts/DashboardLayout';
import { LandingPage } from './features/landing/pages/LandingPage';
import { AuthLayout } from './features/auth';
import { Login } from './features/auth/pages/Login';
import { Signup } from './features/auth/pages/Signup';
import { LoadingPage } from './features/misc/loading/Loading';
import { NotFoundPage } from './features/misc/notFound/NotFound';

// Lazily load components
const Dashboard = lazy(() =>
  import('./features/dashboard/pages/Dashboard').then((module) => ({
    default: module.Dashboard,
  })),
);
const Nutrition = lazy(() =>
  import('./features/nutrition/pages/Nutrition').then((module) => ({
    default: module.Nutrition,
  })),
);
const WorkoutPlanner = lazy(() =>
  import('./features/workoutplanner').then((module) => ({
    default: module.WorkoutPlanner,
  })),
);
const Profile = lazy(() =>
  import('./features/profile').then((module) => ({ default: module.Profile })),
);

/**
 * Main router component that handles application routing
 * Manages authentication state and protected routes
 */
export const Routes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while auth is being checked
  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <Suspense fallback={<LoadingPage />}>
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
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />
            }
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
        <Route path="*" element={<NotFoundPage />} />
      </Switch>
    </Suspense>
  );
};
