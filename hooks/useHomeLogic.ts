'use client';

import { useRoom } from '@/lib/useRoom';
import { isValidRoomCode, normalizeRoomCode } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

/**
 * Custom hook for home page logic
 * Handles room creation and joining
 */
export function useHomeLogic() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { createRoom, joinRoom } = useRoom(null);

  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleCreateRoom = async () => {
    setIsLoading(true);
    setError('');

    try {
      const roomCode = await createRoom();
      router.push(`/room/${roomCode}`);
    } catch (err) {
      console.error('Error creating room:', err);
      setError('Помилка створення кімнати');
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async (roomCode: string) => {
    setIsLoading(true);
    setError('');

    try {
      const success = await joinRoom(roomCode);
      if (success) {
        router.push(`/room/${roomCode}`);
      } else {
        setError('Не вдалося приєднатися до кімнати');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error joining room:', err);
      setError('Помилка приєднання до кімнати');
      setIsLoading(false);
    }
  };

  const handleJoinRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedCode = code.trim();

    if (!trimmedCode) {
      setError('Будь ласка, введіть код кімнати');
      return;
    }

    const normalizedCode = normalizeRoomCode(trimmedCode);
    if (!isValidRoomCode(normalizedCode)) {
      setError('Невірний формат коду (має бути PING-XXXX)');
      return;
    }

    await handleJoinRoom(normalizedCode);
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
    if (error) {
      setError('');
    }
  };

  return {
    code,
    error,
    isLoading,
    handleCreateRoom,
    handleJoinRoomSubmit,
    handleCodeChange,
  };
}
