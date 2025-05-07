import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ISignupFormData } from '../types';
import { GoogleButton } from './GoogleButton';
import { FormInput } from '@/features/auth/components/FormInput';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui';

interface ISignupFormProps {
  onSignup: (data: ISignupFormData) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const SignupForm: React.FC<ISignupFormProps> = ({
  onSignup,
  onGoogleSignIn,
  isLoading,
  error,
}) => {
  const [formData, setFormData] = React.useState<ISignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  });

  const [passwordsMatch, setPasswordsMatch] = React.useState<boolean>(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Check password match when either password field changes
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'confirmPassword') {
        setPasswordsMatch(formData.password === value);
      } else {
        setPasswordsMatch(value === formData.confirmPassword);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    await onSignup(formData);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center font-bold">
          Sign up
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Full Name"
            id="displayName"
            name="displayName"
            type="text"
            autoComplete="name"
            value={formData.displayName}
            onChange={handleChange}
            required
          />
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
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />
          <FormInput
            label="Confirm Password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={` ${!passwordsMatch && formData.confirmPassword ? 'border-destructive' : ''}`}
            autoComplete="new-password"
          />
          {!passwordsMatch && formData.confirmPassword && (
            <p className="text-xs text-destructive mt-1">
              Passwords don't match
            </p>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !passwordsMatch}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter>
        <GoogleButton
          text="Continue with Google"
          onClick={onGoogleSignIn}
          isLoading={isLoading}
        />
      </CardFooter>
    </Card>
  );
};
