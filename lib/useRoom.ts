'use client';

import type { UseRoomResult } from '@/types';
import { useRoomActions } from './useRoomActions';
import { useRoomData } from './useRoomData';

/**
 * Custom hook for managing room state and operations
 * Refactored to compose useRoomData and useRoomActions
 */
export function useRoom(roomCode: string | null): UseRoomResult {
  const { room, loading, error, playerId, user, setError } = useRoomData(roomCode);
  
  const actions = useRoomActions({
    room,
    user,
    setError,
  });

  // Derived state
  const currentPlayer = room?.players?.[playerId] ?? null;
  const pendingInvites = room
    ? Object.entries(room.invites || {})
        .filter(([, invite]) => invite.toPlayerId === playerId)
        .map(([id, invite]) => ({ ...invite, id }))
    : [];

  return {
    room,
    loading,
    error,
    playerId,
    currentPlayer,
    pendingInvites,
    ...actions,
  };
}
