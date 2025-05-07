import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { IUserProfile } from '../profile/types';

/**
 * Fetches a user profile document from Firestore
 * @param userId - The ID of the user to fetch
 * @returns The user profile document or null if it doesn't exist
 */
export const getUserProfileDoc = async (
  userId: string,
): Promise<IUserProfile | null> => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as IUserProfile) : null;
};

/**
 * Creates a new user profile document in Firestore
 * @param userId - The ID of the user to create a profile for
 * @param profileData - The profile data to store
 */
export const createUserProfileDoc = async (
  userId: string,
  profileData: Omit<IUserProfile, 'createdAt' | 'updatedAt'>,
): Promise<void> => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    const now = Timestamp.now();
    await setDoc(docRef, {
      ...profileData,
      createdAt: now,
      updatedAt: now,
    });
  }
};

/**
 * Updates an existing user profile document in Firestore
 * @param userId - The ID of the user to update
 * @param profileData - The profile data to update
 */
export const updateUserProfileDoc = async (
  userId: string,
  profileData: Partial<IUserProfile>,
): Promise<void> => {
  const docRef = doc(db, 'users', userId);
  await updateDoc(docRef, {
    ...profileData,
    updatedAt: Timestamp.now(),
  });
};

/**
 * Deletes a user profile document from Firestore
 * @param userId - The ID of the user to delete
 */
export const deleteUserProfileDoc = async (userId: string): Promise<void> => {
  const docRef = doc(db, 'users', userId);
  await deleteDoc(docRef);
};
