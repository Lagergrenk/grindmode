import { useContext } from 'react';
import { AuthContext } from '@/context/auth.context';

/**
 * Hook to access authentication state and methods
 * @returns Authentication state and methods
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return {
    ...context,
  };
};
