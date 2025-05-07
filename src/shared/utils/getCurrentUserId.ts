import { auth } from '@/config/firebase';

/**
 * Retrieves the current user's ID from the authentication context.
 * @returns The current user's ID as a string.
 */
export const getCurrentUserId = (): string => {
  const user = auth.currentUser;
  if (!user || !user.uid) throw new Error('User not authenticated');
  return user.uid;
};
