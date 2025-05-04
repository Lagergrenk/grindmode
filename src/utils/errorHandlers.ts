import { FirebaseError } from 'firebase/app';
import { IFirebaseAuthError } from '@/types/';

/**
 * Maps Firebase authentication error codes to user-friendly messages
 * Add more error codes as needed
 * @param error Firebase error object
 * @returns User-friendly error message
 */
export const getAuthErrorMessage = (error: unknown): string => {
  if (!error) return 'An unknown error occurred';

  if ((error as IFirebaseAuthError).code) {
    const firebaseError = error as IFirebaseAuthError;

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

/**
 * Maps Firebase Firestore error codes to user-friendly messages
 * @param error Firebase error object
 * @returns User-friendly error message
 */
export const getFirestoreErrorMessage = (error: unknown): string => {
  if (!error) return 'An unknown error occurred';

  if ((error as FirebaseError).code) {
    const firestoreError = error as FirebaseError;

    switch (firestoreError.code) {
      case 'permission-denied':
        return 'You do not have permission to perform this action.';
      case 'not-found':
        return 'The requested data could not be found.';
      case 'already-exists':
        return 'This data already exists.';
      case 'resource-exhausted':
        return 'You have exceeded your quota. Please try again later.';
      case 'failed-precondition':
        return 'Operation failed due to the current state of the data.';
      case 'unavailable':
        return 'The service is currently unavailable. Please try again later.';
      default:
        return `Database error: ${firestoreError.message}`;
    }
  }

  const errorMessage = error instanceof Error ? error.message : String(error);
  return `Error: ${errorMessage}`;
};
