import {
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  Timestamp,
  setDoc,
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { IUserProfile } from '@/types';
import { deleteAccount } from './auth.service';

export const getCurrentUserId = (): string => {
  const user = auth.currentUser;
  if (!user || !user.uid) throw new Error('User not authenticated');
  return user.uid;
};

export const getUserProfile = async (): Promise<IUserProfile | null> => {
  try {
    const userId = getCurrentUserId();
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as IUserProfile) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (
  profileData: Partial<IUserProfile>,
): Promise<void> => {
  try {
    const userId = getCurrentUserId();
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      ...profileData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
};

// Initialize user profile on signup
export const createUserProfile = async (
  profileData: Omit<IUserProfile, 'createdAt' | 'updatedAt'>,
): Promise<void> => {
  try {
    const userId = getCurrentUserId();
    const docRef = doc(db, 'users', userId);
    const now = Timestamp.now();

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return;
    } else {
      await setDoc(docRef, {
        ...profileData,
        createdAt: now,
        updatedAt: now,
      });
    }
  } catch (error) {
    console.error('Error creating user profile:', error);
  }
};

// Delete user profile
export const deleteUserProfile = async (): Promise<void> => {
  try {
    const userId = getCurrentUserId();
    const docRef = doc(db, 'users', userId);
    await deleteDoc(docRef);
    await deleteAccount();
  } catch (error) {
    console.error('Error deleting user profile:', error);
  }
};
