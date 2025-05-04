import { createContext } from 'react';
import { IAuthContext, defaultAuthContext } from '@/types';

// Create the context with default value
export const AuthContext = createContext<IAuthContext>(defaultAuthContext);
