import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Dedicated Firebase Configuration for "You" Diary App
const firebaseConfig = {
  apiKey: "AIzaSyCSwB7ytQ1nnDLRpTJh27huhIYcVw3MJA4",
  authDomain: "you-diary-app.firebaseapp.com",
  projectId: "you-diary-app",
  storageBucket: "you-diary-app.firebasestorage.app",
  messagingSenderId: "1054872857373",
  appId: "1:1054872857373:web:3a370ce02f1c672ca08ff4",
  measurementId: "G-5LH87FGSNK"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);

// Anonymous Auth Session
export const initAnonymousUser = async (): Promise<string | null> => {
  try {
    if (auth.currentUser) {
      return auth.currentUser.uid;
    }
    const cred = await signInAnonymously(auth);
    return cred.user.uid;
  } catch (error) {
    console.log('Firebase Anonymous auth fallback:', error);
    return null;
  }
};

export default app;
