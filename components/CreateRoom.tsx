'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/useAuth';

interface CreateRoomProps {
  onCreateRoom: (playerName?: string) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Component for creating a new room
 * Name is optional - uses Firebase Auth displayName by default
 */
export function CreateRoom({ onCreateRoom, isLoading = false }: CreateRoomProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const displayName = user?.displayName || (user?.isAnonymous ? 'Гість' : 'Гравець');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();

    // Validate if custom name is provided
    if (trimmedName && trimmedName.length < 2) {
      setError("Ім'я має містити мінімум 2 символи");
      return;
    }

    if (trimmedName && trimmedName.length > 20) {
      setError("Ім'я не може бути довшим за 20 символів");
      return;
    }

    try {
      // Pass custom name or undefined to use default from auth
      await onCreateRoom(trimmedName || undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка створення кімнати');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div>
        <label className="block text-sm text-gray-600 mb-2">
          Ім'я в грі (опціонально)
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={displayName}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
          maxLength={20}
        />
        <p className="mt-1 text-xs text-gray-500">
          Залиште порожнім, щоб використати: {displayName}
        </p>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Створення...' : 'Створити кімнату'}
      </button>
    </form>
  );
}
