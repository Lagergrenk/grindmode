import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { LoginForm, ILoginFormData } from '@components/auth';
import { useAuth } from '@hooks/useAuth';
import { getAuthErrorMessage } from '@/utils/errorHandlers';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TriangleAlert } from 'lucide-react';

export const Login: React.FC = () => {
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    login,
    isAuthenticated,
    isLoading: authLoading,
    loginWithGoogle,
  } = useAuth();

  if (isAuthenticated) return <Navigate to="/" />;

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);

    try {
      if (!loginWithGoogle)
        throw new Error('Google Sign-In function is not available');
      await loginWithGoogle();
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (data: ILoginFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      if (!login) throw new Error('Login function is not available');
      await login(data.email, data.password);
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-center">
          Log in to continue your fitness journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <TriangleAlert className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <LoginForm
          onGoogleSignIn={handleGoogleSignIn}
          onLogin={handleLogin}
          isLoading={isLoading || authLoading}
          error={null} // We're handling the error display separately now
        />
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?
          <Link
            to="/signup"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
