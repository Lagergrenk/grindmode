import { AuthLayout } from '@/shared/layouts/AuthLayout';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Route, Navigate } from 'react-router-dom';

export const authRoutes = (isAuthenticated: boolean) => {
  return (
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
  );
};
