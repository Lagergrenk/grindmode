import React, { useState, useEffect } from 'react';
import { AuthContext } from '@/context/auth.context';
import { AuthState } from '@/types';
import {
  signUp,
  signIn,
  signInWithGoogle,
  logOut,
  createAuthContext,
  updateUserAuthProfile,
  deleteAccount,
} from '@/services/auth.service';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({ status: 'loading' });
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Single source of truth for auth state
    const unsubscribe = createAuthContext((state) => {
      setAuthState(state);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      await signIn(email, password);
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };

  const signup = async (
    email: string,
    password: string,
    displayName: string,
  ) => {
    setError(null);
    try {
      await signUp(email, password, displayName);
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await logOut();
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };

  const deleteUser = async () => {
    setError(null);
    try {
      if (authState.status !== 'authenticated') {
        throw new Error('User not authenticated');
      }
      await deleteAccount();
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };

  const editUser = async (
    newDisplayName?: string,
    newPassword?: string,
    newEmail?: string,
  ) => {
    setError(null);
    try {
      if (authState.status !== 'authenticated') {
        throw new Error('User not authenticated');
      }
      await updateUserAuthProfile({
        displayName: newDisplayName,
        password: newPassword,
        email: newEmail,
      });
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };

  const value = {
    isAuthenticated: authState.status === 'authenticated',
    isLoading: authState.status === 'loading',
    user: authState.status === 'authenticated' ? authState.user : null,
    error,
    login,
    loginWithGoogle,
    signup,
    logout,
    editUser,
    deleteUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
