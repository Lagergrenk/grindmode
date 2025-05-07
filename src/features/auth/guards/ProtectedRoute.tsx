import { Outlet, Navigate } from 'react-router-dom';

interface IProtectedRouteProps {
  isAuthenticated: boolean;
}

export const ProtectedRoute: React.FC<IProtectedRouteProps> = ({
  isAuthenticated,
}) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};
