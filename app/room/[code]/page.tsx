'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useRoom } from '@/lib/useRoom';
import { Lobby } from '@/components/Lobby';
import { Game } from '@/components/Game';
import { MatchResult } from '@/types';

interface PageProps {
  params: Promise<{ code: string }>;
}

/**
 * Room page - displays either lobby or game based on room status
 * Uses dynamic routing with [code] parameter
 */
export default function RoomPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();

  const {
    room,
    loading,
    error,
    playerId,
    startGame,
    voteResult,
    incrementScore,
    sendInvite,
    acceptInvite,
    declineInvite,
    leaveRoom,
  } = useRoom(resolvedParams.code);

  const handleCopyRoomCode = async () => {
    if (!room) return;

    try {
      await navigator.clipboard.writeText(room.code);
      // You could add a toast notification here
      alert('Код скопійовано!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleLeaveRoom = async () => {
    if (confirm('Ви впевнені, що хочете вийти з кімнати?')) {
      await leaveRoom();
      router.push('/');
    }
  };

  const handleStartGame = async () => {
    try {
      await startGame();
    } catch (err) {
      console.error('Error starting game:', err);
      alert(err instanceof Error ? err.message : 'Помилка запуску гри');
    }
  };

  const handleVoteResult = async (result: MatchResult) => {
    try {
      await voteResult(result);
    } catch (err) {
      console.error('Error voting:', err);
    }
  };

  const handleIncrementScore = async (team: 'champions' | 'challengers') => {
    try {
      await incrementScore(team);
    } catch (err) {
      console.error('Error incrementing score:', err);
    }
  };

  const handleSendInvite = async (toPlayerId: string) => {
    try {
      await sendInvite(toPlayerId);
    } catch (err) {
      console.error('Error sending invite:', err);
      alert('Помилка відправки запрошення');
    }
  };

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      await acceptInvite(inviteId);
    } catch (err) {
      console.error('Error accepting invite:', err);
      alert('Помилка прийняття запрошення');
    }
  };

  const handleDeclineInvite = async (inviteId: string) => {
    try {
      await declineInvite(inviteId);
    } catch (err) {
      console.error('Error declining invite:', err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎯</div>
          <p className="text-gray-600">Завантаження...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-xl font-semibold text-gray-900">
            {error || 'Кімнату не знайдено'}
          </h2>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Повернутися на головну
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Leave button */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <button
          onClick={handleLeaveRoom}
          className="text-sm text-red-600 hover:text-red-700 focus:outline-none"
        >
          ← Вийти з кімнати
        </button>
      </div>

      {/* Content */}
      {room.status === 'lobby' ? (
        <Lobby
          room={room}
          playerId={playerId}
          onStartGame={handleStartGame}
          onSendInvite={handleSendInvite}
          onAcceptInvite={handleAcceptInvite}
          onDeclineInvite={handleDeclineInvite}
          onCopyRoomCode={handleCopyRoomCode}
        />
      ) : (
        <Game
          room={room}
          playerId={playerId}
          onVoteResult={handleVoteResult}
          onIncrementScore={handleIncrementScore}
          onCopyRoomCode={handleCopyRoomCode}
        />
      )}
    </div>
  );
}
