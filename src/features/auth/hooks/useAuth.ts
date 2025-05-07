import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

/**
 * Custom hook to use authentication context
 * @returns Auth context with user data and authentication methods
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return {
    ...context,
  };
};
