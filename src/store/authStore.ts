import { create } from 'zustand';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import type { User } from '../types/user';
import { authApi } from '../api/auth.api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
  checkAuth: () => void;
  initAuthListener: () => () => void;
}

// Map Firebase error codes to user-friendly messages
function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
      return 'Invalid email or password';
    case 'auth/wrong-password':
      return 'Invalid email or password';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection';
    default:
      return 'An unexpected error occurred. Please try again';
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authApi.login({ email, password });
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      const message = getFirebaseErrorMessage(error.code || '');
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authApi.register(data);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      const message = getFirebaseErrorMessage(error.code || '');
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // Continue with logout even if it fails
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  clearError: () => set({ error: null }),

  checkAuth: () => {
    // For Firebase, we use initAuthListener instead
    // But keep this for backward compatibility
    const currentUser = auth.currentUser;
    if (currentUser) {
      // User is signed in, fetch profile
      getDoc(doc(db, 'users', currentUser.uid)).then((snap) => {
        if (snap.exists()) {
          set({ user: snap.data() as User, isAuthenticated: true });
        }
      });
    }
  },

  // Firebase auth state listener — call once on app init
  initAuthListener: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userSnap.exists()) {
            set({ user: userSnap.data() as User, isAuthenticated: true, isLoading: false });
          } else {
            // User exists in Auth but not Firestore — create profile
            const user: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
              lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
              role: 'CUSTOMER',
              createdAt: new Date().toISOString(),
            };
            set({ user, isAuthenticated: true, isLoading: false });
          }
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });

    return unsubscribe;
  },
}));
