import { getCurrentUserId } from '@/shared/utils/getCurrentUserId';
import { IUserProfile } from '../profile/types';
import {
  getUserProfileDoc,
  createUserProfileDoc,
  updateUserProfileDoc,
  deleteUserProfileDoc,
} from './firebase';

/**
 * Fetches the current user's profile from Firestore
 * @returns The user profile or null if not found
 */
export const getUserProfile = async (): Promise<IUserProfile | null> => {
  try {
    const userId = getCurrentUserId();
    return await getUserProfileDoc(userId);
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

/**
 * Updates the current user's profile in Firestore
 * @param profileData - Partial user profile data to update
 */
export const updateUserProfile = async (
  profileData: Partial<IUserProfile>,
): Promise<void> => {
  try {
    const userId = getCurrentUserId();
    await updateUserProfileDoc(userId, profileData);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update profile');
  }
};

/**
 * Creates a new profile for the current user if it doesn't exist
 * @param profileData - User profile data without timestamp fields
 */
export const createUserProfile = async (
  profileData: Omit<IUserProfile, 'createdAt' | 'updatedAt'>,
): Promise<void> => {
  try {
    const userId = getCurrentUserId();
    await createUserProfileDoc(userId, profileData);
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new Error('Failed to create profile');
  }
};

/**
 * Deletes the current user's profile from Firestore
 */
export const deleteUserProfile = async (): Promise<void> => {
  try {
    const userId = getCurrentUserId();
    await deleteUserProfileDoc(userId);
  } catch (error) {
    console.error('Error deleting user profile:', error);
    throw new Error('Failed to delete profile');
  }
};
