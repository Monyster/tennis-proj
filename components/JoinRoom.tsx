'use client';

import { useState } from 'react';
import { normalizeRoomCode, isValidRoomCode } from '@/lib/utils';
import { useAuth } from '@/lib/useAuth';

interface JoinRoomProps {
  onJoinRoom: (code: string, playerName?: string) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Component for joining an existing room
 * Name is optional - uses Firebase Auth displayName by default
 */
export function JoinRoom({ onJoinRoom, isLoading = false }: JoinRoomProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const displayName = user?.displayName || (user?.isAnonymous ? 'Гість' : 'Гравець');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    const trimmedCode = code.trim();

    // Validate custom name if provided
    if (trimmedName && trimmedName.length < 2) {
      setError("Ім'я має містити мінімум 2 символи");
      return;
    }

    if (trimmedName && trimmedName.length > 20) {
      setError("Ім'я не може бути довшим за 20 символів");
      return;
    }

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
      await onJoinRoom(normalizedCode, trimmedName || undefined);
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
          Ім'я в грі (опціонально)
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={displayName}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          disabled={isLoading}
          maxLength={20}
        />
        <p className="mt-1 text-xs text-gray-500">
          Залиште порожнім, щоб використати: {displayName}
        </p>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-2">
          Код кімнати
        </label>
        <input
          type="text"
          value={code}
          onChange={handleCodeChange}
          placeholder="PING-1234"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
          disabled={isLoading}
          maxLength={9}
          autoCapitalize="characters"
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || !code.trim()}
        className="w-full px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Приєднання...' : 'Приєднатись'}
      </button>
    </form>
  );
}
