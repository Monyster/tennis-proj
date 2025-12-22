'use client';

import { useState } from 'react';

interface CreateRoomProps {
  onCreateRoom: () => Promise<void>;
  isLoading?: boolean;
}

/**
 * Component for creating a new room
 * Uses Firebase Auth displayName or generated name automatically
 */
export function CreateRoom({ onCreateRoom, isLoading = false }: CreateRoomProps) {
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await onCreateRoom();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка створення кімнати');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}

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
