import React, { useState, useEffect } from 'react';
import { AuthContext } from '../context/authContext';
import { IAuthUser } from '../types';
import {
  firebaseSignIn,
  firebaseSignUp,
  firebaseSignInWithGoogle,
  firebaseSignOut,
  firebaseUpdateProfile,
  firebaseOnAuthStateChanged,
  firebaseDeleteUser,
  firebaseAuth,
  firebaseGetAdditionalUserInfo,
} from '../firebase';
import { getAuthErrorMessage } from '../utils/firebaseAuthErrorHandler';
import { createUserProfile } from '@/features/profile';

/**
 * Provider component that makes authentication available throughout the app
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [status, setStatus] = useState<
    'loading' | 'authenticated' | 'unauthenticated'
  >('loading');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = firebaseOnAuthStateChanged(firebaseAuth, (authUser) => {
      if (authUser) {
        setUser({
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName,
          photoURL: authUser.photoURL,
        } as IAuthUser);
        setStatus('authenticated');
      } else {
        setUser(null);
        setStatus('unauthenticated');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  /**
   * Handles user login with email and password
   * @param email - User's email
   * @param password - User's password
   */
  const login = async (email: string, password: string): Promise<void> => {
    setError(null);
    try {
      await firebaseSignIn(email, password);
    } catch (err) {
      const errorMsg = getAuthErrorMessage(err);
      const error = new Error(errorMsg);
      setError(error);
      throw error;
    }
  };

  /**
   * Handles user login with Google
   */
  const loginWithGoogle = async (): Promise<void> => {
    setError(null);
    try {
      const userCredentials = await firebaseSignInWithGoogle();
      const additionalUserInfo = firebaseGetAdditionalUserInfo(userCredentials);
      if (!additionalUserInfo?.isNewUser) return;

      await createUserProfile({
        email: userCredentials.user.email || '',
        displayName: userCredentials.user.displayName || '',
      });
    } catch (err) {
      const errorMsg = getAuthErrorMessage(err);
      const error = new Error(errorMsg);
      setError(error);
      throw error;
    }
  };

  /**
   * Registers a new user
   * @param email - User's email
   * @param password - User's password
   * @param displayName - User's display name
   */
  const signup = async (
    email: string,
    password: string,
    displayName: string,
  ): Promise<void> => {
    setError(null);
    try {
      const userCredential = await firebaseSignUp(email, password);
      if (userCredential.user) {
        await firebaseUpdateProfile({ displayName });
      }
    } catch (err) {
      const errorMsg = getAuthErrorMessage(err);
      const error = new Error(errorMsg);
      setError(error);
      throw error;
    }
  };

  /**
   * Logs out the current user
   */
  const logout = async (): Promise<void> => {
    setError(null);
    try {
      await firebaseSignOut();
    } catch (err) {
      const errorMsg = getAuthErrorMessage(err);
      const error = new Error(errorMsg);
      setError(error);
      throw error;
    }
  };

  /**
   * Updates user profile information
   * @param data - Profile data to update
   */
  const updateProfile = async (data: {
    displayName?: string;
    password?: string;
    email?: string;
  }): Promise<void> => {
    setError(null);
    try {
      const { displayName } = data;
      if (displayName) {
        await firebaseUpdateProfile({ displayName });
      }
      // Note: Updating email and password requires different Firebase methods
      // and may need additional implementation
    } catch (err) {
      const errorMsg = getAuthErrorMessage(err);
      const error = new Error(errorMsg);
      setError(error);
      throw error;
    }
  };

  /**
   * Deletes the current user account
   */
  const deleteProfile = async (): Promise<void> => {
    setError(null);
    try {
      await firebaseDeleteUser();
    } catch (err) {
      const errorMsg = getAuthErrorMessage(err);
      const error = new Error(errorMsg);
      setError(error);
      throw error;
    }
  };

  const contextValue = {
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    user,
    error,
    login,
    loginWithGoogle,
    signup,
    logout,
    updateProfile,
    deleteProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
