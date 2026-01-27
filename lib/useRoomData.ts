'use client';

import type { Room } from '@/types';
import { onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { db } from './firebase';
import { useAuth } from './useAuth';
import { normalizeRoomCode } from './utils';

export function useRoomData(roomCode: string | null) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const playerId = user?.uid || '';

  useEffect(() => {
    if (!roomCode) {
      setLoading(false);
      return;
    }

    const normalized = normalizeRoomCode(roomCode);
    const roomRef = ref(db, `rooms/${normalized}`);

    setLoading(true);
    setError(null);

    const unsubscribe = onValue(
      roomRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Normalize data to ensure all fields are initialized
          const normalizedRoom: Room = {
            ...data,
            teams: data.teams || {},
            invites: data.invites || {},
            queue: data.queue || [],
            bench: data.bench || [],
            votes: data.votes || {
              pendingResult: null,
              voters: {},
              startedAt: null,
            },
          };
          setRoom(normalizedRoom);
        } else {
          setRoom(null);
          setError('Кімнату не знайдено');
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [roomCode]);

  return { room, loading, error, playerId, user, setError, setLoading };
}
