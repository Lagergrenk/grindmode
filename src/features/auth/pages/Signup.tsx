import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { SignupForm } from '@/features/auth/components/SignupForm';
import { ISignupFormData } from '../types';
import { auth } from '@/config/firebase';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Alert,
  AlertDescription,
  CardFooter,
} from '@/components/ui';
import { TriangleAlert } from 'lucide-react';

/**
 * Signup page component that handles user registration
 */
export const Signup = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  /**
   * Handles the signup process using email/password
   * @param formData - User registration data from the form
   */
  const handleSignup = async (formData: ISignupFormData) => {
    const { email, password, displayName } = formData;

    setIsLoading(true);
    setError(null);

    try {
      // Create the user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Update the user's display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: displayName,
        });
      }

      // Redirect to the dashboard or home page after successful signup
      navigate('/dashboard');
    } catch (err) {
      // Handle signup errors
      let errorMessage = 'Failed to create account. Please try again.';

      if (err instanceof Error) {
        // Extract more specific error message from Firebase error codes
        if (err.message.includes('email-already-in-use')) {
          errorMessage =
            'This email is already registered. Please use another email or login.';
        } else if (err.message.includes('weak-password')) {
          errorMessage = 'Password should be at least 6 characters long.';
        } else if (err.message.includes('invalid-email')) {
          errorMessage = 'Please enter a valid email address.';
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles Google sign-in functionality
   */
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      // Redirect after successful Google sign-in
      navigate('/dashboard');
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
      console.error('Google sign-in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Create your account
        </CardTitle>
        <CardDescription className="text-center">
          Join GrindMode to track your fitness journey
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
          error={error}
          onGoogleSignIn={handleGoogleSignIn}
        />
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
