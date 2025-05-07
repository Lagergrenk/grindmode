import { FirebaseError } from 'firebase/app';
/**
 * Maps Firebase authentication error codes to user-friendly messages
 * Add more error codes as needed
 * @param error Firebase error object
 * @returns User-friendly error message
 */
export const getAuthErrorMessage = (error: unknown): string => {
  if (!error) return 'An unknown error occurred';

  if ((error as FirebaseError).code) {
    const firebaseError = error as FirebaseError;

    switch (firebaseError.code) {
      // Sign-up errors
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please use a different email or try logging in.';
      case 'auth/invalid-email':
        return 'Invalid email address. Please check your email and try again.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use a stronger password.';

      // Sign-in errors
      case 'auth/user-not-found':
        return 'No account found with this email. Please check your email or create a new account.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again or reset your password.';
      case 'auth/too-many-requests':
        return 'Too many unsuccessful login attempts. Please try again later or reset your password.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support for assistance.';

      // Network errors
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';

      // Default case
      default:
        return `Authentication error: ${firebaseError.message}`;
    }
  }

  // Handle non-Firebase errors or unknown errors
  const errorMessage = error instanceof Error ? error.message : String(error);
  return `Error: ${errorMessage}`;
};
