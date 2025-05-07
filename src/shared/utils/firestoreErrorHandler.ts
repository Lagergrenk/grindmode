import { FirebaseError } from 'firebase/app';

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
