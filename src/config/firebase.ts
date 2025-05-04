import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyC-DVPD-4CjDQ0nYOjg5y2hMOy1zjx6VeU',
  authDomain: 'grindmode-5d2bb.firebaseapp.com',
  projectId: 'grindmode-5d2bb',
  storageBucket: 'grindmode-5d2bb.firebasestorage.app',
  messagingSenderId: '1096214127157',
  appId: '1:1096214127157:web:7b82fd19693d933f3f877c',
  measurementId: 'G-XJN3G8434B',
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };
