export interface IAuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  createdAt: string | null;
}

export type AuthState =
  | { status: 'loading' }
  | { status: 'authenticated'; user: IAuthUser }
  | { status: 'unauthenticated' };

/**
 * Interface defining the authentication context available throughout the application
 */
export interface IAuthContext {
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
  editUser: (
    newDisplayName?: string,
    newPassword?: string,
    newEmail?: string,
  ) => Promise<void>;
  deleteUser: () => Promise<void>;
}

/**
 * Default context values used before the AuthProvider is initialized
 */
export const defaultAuthContext: IAuthContext = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null,
  login: async () => {
    throw new Error('login not implemented');
  },
  loginWithGoogle: async () => {
    throw new Error('loginWithGoogle not implemented');
  },
  signup: async () => {
    throw new Error('signup not implemented');
  },
  logout: async () => {
    throw new Error('logout not implemented');
  },
  editUser: async () => {
    throw new Error('editUser not implemented');
  },
  deleteUser: async () => {
    throw new Error('deleteUser not implemented');
  },
};
