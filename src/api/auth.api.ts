import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import type { User, AuthResponse } from '../types/user';

export const authApi = {
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<AuthResponse> => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    // Set display name on Firebase Auth profile
    await updateProfile(credential.user, {
      displayName: `${data.firstName} ${data.lastName}`,
    });

    // Create user document in Firestore
    const userDoc: User = {
      id: credential.user.uid,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: 'CUSTOMER',
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', credential.user.uid), userDoc);

    const token = await credential.user.getIdToken();

    return {
      user: userDoc,
      accessToken: token,
      refreshToken: credential.user.refreshToken,
    };
  },

  login: async (data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const credential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    // Get user profile from Firestore
    const userSnap = await getDoc(doc(db, 'users', credential.user.uid));
    let user: User;

    if (userSnap.exists()) {
      user = userSnap.data() as User;
    } else {
      // Create a profile if it doesn't exist (e.g. for manually created users)
      user = {
        id: credential.user.uid,
        email: credential.user.email || data.email,
        firstName: credential.user.displayName?.split(' ')[0] || 'User',
        lastName: credential.user.displayName?.split(' ').slice(1).join(' ') || '',
        role: 'CUSTOMER',
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', credential.user.uid), user);
    }

    const token = await credential.user.getIdToken();

    return {
      user,
      accessToken: token,
      refreshToken: credential.user.refreshToken,
    };
  },

  logout: async (_refreshToken?: string) => {
    await signOut(auth);
  },

  refreshToken: async (_refreshToken: string) => {
    // Firebase handles token refresh automatically
    const currentUser = auth.currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken(true);
      return {
        accessToken: token,
        refreshToken: currentUser.refreshToken,
      };
    }
    throw new Error('No authenticated user');
  },

  // Helper to get current user profile from Firestore
  getCurrentUserProfile: async (): Promise<User | null> => {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    const userSnap = await getDoc(doc(db, 'users', currentUser.uid));
    if (userSnap.exists()) {
      return userSnap.data() as User;
    }
    return null;
  },
};
