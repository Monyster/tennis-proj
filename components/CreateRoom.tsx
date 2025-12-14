'use client';

import { useState } from 'react';
import { getPlayerName } from '@/lib/utils';

interface CreateRoomProps {
  onCreateRoom: (playerName: string) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Component for creating a new room
 * Follows Presentation Component pattern
 */
export function CreateRoom({ onCreateRoom, isLoading = false }: CreateRoomProps) {
  const [name, setName] = useState(getPlayerName() || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Будь ласка, введіть своє ім'я");
      return;
    }

    if (trimmedName.length < 2) {
      setError("Ім'я має містити мінімум 2 символи");
      return;
    }

    if (trimmedName.length > 20) {
      setError("Ім'я не може бути довшим за 20 символів");
      return;
    }

    try {
      await onCreateRoom(trimmedName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка створення кімнати');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Твоє ім'я"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
          maxLength={20}
          autoFocus
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || !name.trim()}
        className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Створення...' : 'Створити кімнату'}
      </button>
    </form>
  );
}
