import { auth } from '@/config/firebase';
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

export const firebaseSignUp = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const firebaseSignIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const firebaseSignOut = () => signOut(auth);

export const firebaseUpdateProfile = (profile: { displayName?: string }) =>
  auth.currentUser && updateProfile(auth.currentUser, profile);

export const firebaseDeleteUser = () =>
  auth.currentUser && deleteUser(auth.currentUser);

export const firebaseGetCurrentUser = (): User | null => auth.currentUser;

export const firebaseOnAuthStateChanged = onAuthStateChanged;

export const firebaseSignInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const firebaseGetAdditionalUserInfo = getAdditionalUserInfo;

export const firebaseCurrentUser = auth.currentUser;

export const firebaseAuth = auth;
