import { FirebaseError } from 'firebase/app';

export interface IFirebaseAuthError extends FirebaseError {
  code: string;
  message: string;
}
