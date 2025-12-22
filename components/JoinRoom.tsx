'use client';

import { useState } from 'react';
import { normalizeRoomCode, isValidRoomCode } from '@/lib/utils';

interface JoinRoomProps {
  onJoinRoom: (code: string) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Component for joining an existing room
 * Uses Firebase Auth displayName or generated name automatically
 */
export function JoinRoom({ onJoinRoom, isLoading = false }: JoinRoomProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      await onJoinRoom(normalizedCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка приєднання до кімнати');
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Auto-format as user types
    const value = e.target.value.toUpperCase();
    setCode(value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div>
        <label className="block text-sm text-gray-600 mb-2">
          Код кімнати
        </label>
        <input
          type="text"
          value={code}
          onChange={handleCodeChange}
          placeholder="PING-1234"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
          disabled={isLoading}
          maxLength={9}
          autoCapitalize="characters"
        />
        {error && (
          <p className="mt-2 text-sm text-error-600">{error}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || !code.trim()}
        className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Приєднання...' : 'Приєднатись'}
      </button>
    </form>
  );
}
