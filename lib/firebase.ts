import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCizlYqpNkHhXIBG_B-LK-QGFdhzsGoKyA",
  authDomain: "dependa-60c3f.firebaseapp.com",
  projectId: "dependa-60c3f",
  storageBucket: "dependa-60c3f.firebasestorage.app",
  messagingSenderId: "341154002973",
  appId: "1:341154002973:web:9b9dbbddbf25af4eb86ef4",
  measurementId: "G-H24H881P23"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Add scopes for Google Calendar
googleProvider.addScope('https://www.googleapis.com/auth/calendar');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.events');

export default app;

