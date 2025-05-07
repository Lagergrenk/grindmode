import { createContext } from 'react';
import { IAuthUser } from '../types';

/**
 * Interface defining the authentication context value shape
 */
export interface IAuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: IAuthUser | null;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: {
    displayName?: string;
    password?: string;
    email?: string;
  }) => Promise<void>;
  deleteProfile: () => Promise<void>;
}

/**
 * Default context value with empty implementations
 */
const defaultContextValue: IAuthContextValue = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null,
  login: async () => {},
  loginWithGoogle: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  deleteProfile: async () => {},
};

/**
 * Authentication context that provides auth state and operations throughout the app
 */
export const AuthContext =
  createContext<IAuthContextValue>(defaultContextValue);
