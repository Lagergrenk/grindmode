import { FirebaseError } from 'firebase/app';

export interface IAuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  createdAt?: string;
}

export type AuthState =
  | { status: 'loading' }
  | { status: 'authenticated'; user: IAuthUser }
  | { status: 'unauthenticated' };

export interface ILoginFormData {
  email: string;
  password: string;
}

export interface ISignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}

export interface IAuthContext {
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface IFirebaseAuthError extends FirebaseError {
  code: string;
  message: string;
}
