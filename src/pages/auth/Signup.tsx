import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SignupForm, ISignupFormData } from '@components/auth';
import { useAuth } from '@hooks/useAuth';
import { getAuthErrorMessage } from '@/utils/errorHandlers';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TriangleAlert } from 'lucide-react';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleSignup = async (data: ISignupFormData) => {
    setError(null);

    try {
      setIsLoading(true);
      if (!signup) throw new Error('Signup function is not available');
      await signup(data.email, data.password, data.displayName);

      navigate('/dashboard');
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
          Create Your Account
        </CardTitle>
        <CardDescription className="text-center">
          Join GrindMode to start tracking your fitness journey
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <TriangleAlert className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <SignupForm
          onSignup={handleSignup}
          isLoading={isLoading}
          error={null} // We're handling the error display separately now
        />
      </CardContent>
    </Card>
  );
};
