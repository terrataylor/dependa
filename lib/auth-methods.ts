import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { createOrUpdateUser } from './firestore';

// Popup-based sign in (faster but can be blocked)
export const signInWithGooglePopup = async () => {
  try {
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const result = await signInWithPopup(auth, googleProvider);
    
    await createOrUpdateUser({
      uid: result.user.uid,
      email: result.user.email || '',
      displayName: result.user.displayName || '',
      photoURL: result.user.photoURL || undefined,
    });
    
    return result.user;
  } catch (error: any) {
    console.error('Popup sign-in error:', error);
    throw error;
  }
};

// Redirect-based sign in (more reliable, no popup issues)
export const signInWithGoogleRedirect = async () => {
  try {
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    
    await signInWithRedirect(auth, googleProvider);
  } catch (error: any) {
    console.error('Redirect sign-in error:', error);
    throw error;
  }
};

// Check for redirect result after returning from Google
export const checkRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    
    if (result && result.user) {
      await createOrUpdateUser({
        uid: result.user.uid,
        email: result.user.email || '',
        displayName: result.user.displayName || '',
        photoURL: result.user.photoURL || undefined,
      });
      
      return result.user;
    }
    
    return null;
  } catch (error: any) {
    console.error('Redirect result error:', error);
    throw error;
  }
};

