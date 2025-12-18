'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  User,
  signInWithPopup,
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  linkWithPopup,
} from 'firebase/auth';
import { firebaseAuth } from './firebase';

export interface UseAuthResult {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signInAnonymous: () => Promise<void>;
  upgradeAnonymousToGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAnonymous: boolean;
}

/**
 * Custom hook for managing Firebase Authentication
 * Supports Google Sign-In and Anonymous authentication
 */
export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  /**
   * Sign in with Google
   */
  const signInWithGoogle = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(firebaseAuth, provider);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка авторизації через Google';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Sign in anonymously (for guests)
   */
  const signInAnonymous = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await signInAnonymously(firebaseAuth);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка анонімної авторизації';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Upgrade anonymous account to Google account
   */
  const upgradeAnonymousToGoogle = useCallback(async (): Promise<void> => {
    if (!user || !user.isAnonymous) {
      setError('Тільки анонімні користувачі можуть оновити акаунт');
      return;
    }

    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      await linkWithPopup(user, provider);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка оновлення акаунту';
      setError(errorMessage);
      throw err;
    }
  }, [user]);

  /**
   * Sign out
   */
  const signOut = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await firebaseSignOut(firebaseAuth);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка виходу';
      setError(errorMessage);
      throw err;
    }
  }, []);

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    signInAnonymous,
    upgradeAnonymousToGoogle,
    signOut,
    isAnonymous: user?.isAnonymous ?? false,
  };
}
