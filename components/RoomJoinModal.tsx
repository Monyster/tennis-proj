'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/useAuth';

interface RoomJoinModalProps {
  roomCode: string;
  onJoin: () => Promise<void>;
  onCancel: () => void;
}

/**
 * Modal for joining a room
 * Shows auth options (Google or Anonymous) and join button
 */
export function RoomJoinModal({ roomCode, onJoin, onCancel }: RoomJoinModalProps) {
  const { user, signInWithGoogle, signInAnonymous } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setAuthError(null);
      await signInWithGoogle();
      // After auth, user will be set and they can join
    } catch (error) {
      console.error('Google sign in error:', error);
      setAuthError('Помилка авторизації через Google');
    }
  };

  const handleAnonymousSignIn = async () => {
    try {
      setAuthError(null);
      await signInAnonymous();
      // After auth, user will be set and they can join
    } catch (error) {
      console.error('Anonymous sign in error:', error);
      setAuthError('Помилка анонімної авторизації');
    }
  };

  const handleJoin = async () => {
    if (!user) return;

    try {
      setIsJoining(true);
      await onJoin();
    } catch (error) {
      console.error('Join error:', error);
      setAuthError('Помилка приєднання до кімнати');
      setIsJoining(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-75">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Приєднатися до гри
          </h2>
          <div className="inline-block px-5 py-3 bg-blue-600 rounded-xl shadow-md">
            <p className="text-xs text-blue-100 uppercase tracking-wide">Кімната</p>
            <p className="text-2xl font-mono font-bold text-white">{roomCode}</p>
          </div>
        </div>

        {authError && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-xl">
            <p className="text-sm text-red-700 font-medium text-center">{authError}</p>
          </div>
        )}

        {!user ? (
          // Not authenticated - show auth options
          <div className="space-y-4">
            <p className="text-center text-base text-gray-700 mb-6 font-medium">
              Оберіть спосіб входу:
            </p>

            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-300 text-gray-800 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Увійти через Google
            </button>

            <button
              onClick={handleAnonymousSignIn}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all shadow-md"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Увійти як гість
            </button>

            <button
              onClick={onCancel}
              className="w-full px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium"
            >
              Скасувати
            </button>
          </div>
        ) : (
          // Authenticated - show join button
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
              <p className="text-sm text-green-900 font-medium">
                Ви увійшли як{' '}
                <span className="font-bold text-green-700">
                  {user.displayName || (user.isAnonymous ? 'Гість' : 'Користувач')}
                </span>
              </p>
            </div>

            <button
              onClick={handleJoin}
              disabled={isJoining}
              className="w-full px-6 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {isJoining ? 'Приєднання...' : 'Приєднатися до гри'}
            </button>

            <button
              onClick={onCancel}
              disabled={isJoining}
              className="w-full px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50 font-medium"
            >
              Скасувати
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500 font-medium">
            Настільний теніс з автоматичною форою
          </p>
        </div>
      </div>
    </div>
  );
}
