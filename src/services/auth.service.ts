import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  deleteUser,
  User,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
} from 'firebase/auth';

import { auth } from '../config/firebase';
import { AuthState, IAuthUser, IUserProfile } from '@/types';
import { createUserProfile } from './profile.service';

export const AUTH_ERRORS = {
  USER_NOT_AUTHENTICATED: 'User is not authenticated',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_IN_USE: 'Email address is already in use',
  WEAK_PASSWORD: 'Password is too weak',
} as const;

/**
 * Creates a new user account with email and password
 * @param email - User's email address
 * @param password - User's password
 * @param displayName - User's display name
 */
export const signUp = async (
  email: string,
  password: string,
  displayName: string,
): Promise<void> => {
  await createUserWithEmailAndPassword(auth, email, password);

  if (auth.currentUser) {
    await updateProfile(auth.currentUser, {
      displayName,
    });
    await initFirebaseUserProfile(displayName);
  }
};

/**
 * Signs in a user with email and password
 * @param email - User's email address
 * @param password - User's password
 */
export const signIn = async (
  email: string,
  password: string,
): Promise<void> => {
  await signInWithEmailAndPassword(auth, email, password);
};

/**
 * Signs in a user with Google authentication
 * If the user is signing in for the first time, a profile is created
 */
export const signInWithGoogle = async (): Promise<void> => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);

  // Check if this is a new user
  // The additionalUserInfo.isNewUser property tells us if this is a first-time sign in
  const additionalUserInfo = getAdditionalUserInfo(userCredential);

  // If this is a new user, initialize their profile
  if (additionalUserInfo?.isNewUser && auth.currentUser) {
    await updateProfile(auth.currentUser, {
      displayName: auth.currentUser.displayName,
    });
    await initFirebaseUserProfile(auth.currentUser.displayName || '');
  }
};

/**
 * Signs out the current user
 */
export const logOut = async (): Promise<void> => {
  await signOut(auth);
};

/**
 * Updates the current user's profile information
 * @param profileData - Object containing fields to update (displayName, password, email)
 */
export const updateUserAuthProfile = async (profileData: {
  displayName?: string;
  password?: string;
  email?: string;
}): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error(AUTH_ERRORS.USER_NOT_AUTHENTICATED);
  }
  await updateProfile(auth.currentUser, profileData);
};

/**
 * Deletes the current user's account
 */
export const deleteAccount = async (): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error(AUTH_ERRORS.USER_NOT_AUTHENTICATED);
  }
  await deleteUser(auth.currentUser);
};

/**
 * Gets the current authenticated user
 * @returns The current Firebase User object or null if not authenticated
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Maps a Firebase User to our application's IAuthUser interface
 * @param user - Firebase User object
 * @returns IAuthUser object
 */
export const mapUserToAuthUser = (user: User): IAuthUser => {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
};

/**
 * Subscribes to authentication state changes
 * @param callback - Function to call when auth state changes
 * @returns Unsubscribe function
 */
export const onAuthStateChange = (
  callback: (user: IAuthUser | null) => void,
): (() => void) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback(mapUserToAuthUser(user));
    } else {
      callback(null);
    }
  });
};

/**
 * Creates an auth context with state management
 * @param callback - Function to call with updated auth state
 * @returns Unsubscribe function
 */
export const createAuthContext = (
  callback: (authState: AuthState) => void,
): (() => void) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        status: 'authenticated',
        user: mapUserToAuthUser(user),
      });
    } else {
      callback({ status: 'unauthenticated' });
    }
  });
};

/**
 * Helper function to initialize user profile in Firestore
 * @param displayName - User's display name
 */
const initFirebaseUserProfile = async (displayName: string): Promise<void> => {
  const profiledata: Omit<IUserProfile, 'createdAt' | 'updatedAt'> = {
    displayName: displayName,
    goals: [{ dailyCalories: 0, dailyProtein: 0, weeklyWorkouts: 0 }],
  };
  await createUserProfile(profiledata);
};
