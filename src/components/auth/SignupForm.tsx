import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export interface ISignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}

interface ISignupFormProps {
  onSignup: (data: ISignupFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const SignupForm: React.FC<ISignupFormProps> = ({
  onSignup,
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="displayName">Full Name</Label>
        <Input
          type="text"
          id="displayName"
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
          placeholder="Enter your name"
          disabled={isLoading}
          minLength={3}
          required
          className="w-full"
          autoComplete="name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          disabled={isLoading}
          required
          className="w-full"
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          disabled={isLoading}
          required
          className="w-full"
          autoComplete="new-password"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          disabled={isLoading}
          required
          className={`w-full ${!passwordsMatch && formData.confirmPassword ? 'border-destructive' : ''}`}
          autoComplete="new-password"
        />
        {!passwordsMatch && formData.confirmPassword && (
          <p className="text-xs text-destructive mt-1">Passwords don't match</p>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="pt-2">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </div>

      <div className="pt-2">
        <Button type="button" variant="outline" className="w-full" disabled>
          <span className="text-sm text-muted-foreground">
            Sign up with Google
          </span>
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?
        <Link to="/login" className="text-primary hover:underline">
          Log in
        </Link>
      </div>
    </form>
  );
};
