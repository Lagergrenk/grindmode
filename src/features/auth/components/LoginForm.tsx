import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';

import { FormInput } from '@/features/auth/components/FormInput';
import { ILoginFormData } from '../types';
import { GoogleButton } from './GoogleButton';

/**
 * Props for the LoginForm component
 */
interface ILoginFormProps {
  onLogin: (data: ILoginFormData) => void;
  isLoading: boolean;
  onGoogleSignIn?: () => void;
}

/**
 * A form component for user authentication
 */
export const LoginForm = ({
  onLogin,
  isLoading,
  onGoogleSignIn,
}: ILoginFormProps) => {
  const [formData, setFormData] = useState<ILoginFormData>({
    email: '',
    password: '',
  });

  /**
   * Handles input field changes
   * @param e - Change event from input field
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handles form submission
   * @param e - Form submit event
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onLogin(formData);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center font-bold">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Email"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Password"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </CardContent>
      {onGoogleSignIn && (
        <CardFooter>
          <GoogleButton
            onClick={onGoogleSignIn}
            isLoading={isLoading}
            text="Continue with Google"
          />
        </CardFooter>
      )}
    </Card>
  );
};
