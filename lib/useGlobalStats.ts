'use client';

import { onValue, ref, set, update } from 'firebase/database';
import { useCallback, useEffect, useState } from 'react';
import type { GlobalStats } from '@/types';
import { EMPTY_GLOBAL_STATS } from '@/types';
import { db } from './firebase';

/**
 * Hook for managing global player statistics across all rooms
 */
export function useGlobalStats(userId: string | null) {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Subscribe to user's global stats
  useEffect(() => {
    if (!userId) {
      setStats(null);
      setLoading(false);
      return;
    }

    const statsRef = ref(db, `users/${userId}/globalStats`);
    setLoading(true);

    const unsubscribe = onValue(
      statsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setStats(data as GlobalStats);
        } else {
          // Initialize with empty stats if not exists
          setStats(EMPTY_GLOBAL_STATS);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error loading global stats:', error);
        setStats(EMPTY_GLOBAL_STATS);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [userId]);

  /**
   * Initialize global stats for a new user
   */
  const initializeStats = useCallback(
    async (displayName: string, photoURL?: string) => {
      if (!userId) return;

      const userRef = ref(db, `users/${userId}`);
      const userData = {
        displayName,
        ...(photoURL && { photoURL }),
        globalStats: EMPTY_GLOBAL_STATS,
      };

      await set(userRef, userData);
    },
    [userId],
  );

  /**
   * Update stats after a match
   * @param won - Whether the player won or lost
   */
  const updateStats = useCallback(
    async (won: boolean) => {
      if (!userId || !stats) return;

      const updates: Record<string, unknown> = {
        [`users/${userId}/globalStats/gamesPlayed`]: stats.gamesPlayed + 1,
        [`users/${userId}/globalStats/lastPlayed`]: Date.now(),
      };

      if (won) {
        updates[`users/${userId}/globalStats/totalWins`] = stats.totalWins + 1;
      } else {
        updates[`users/${userId}/globalStats/totalLosses`] = stats.totalLosses + 1;
      }

      await update(ref(db), updates);
    },
    [userId, stats],
  );

  /**
   * Update display name
   */
  const updateDisplayName = useCallback(
    async (newName: string) => {
      if (!userId) return;

      await update(ref(db), {
        [`users/${userId}/displayName`]: newName,
      });
    },
    [userId],
  );

  return {
    stats,
    loading,
    initializeStats,
    updateStats,
    updateDisplayName,
  };
}
