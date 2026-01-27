'use client';

import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { Drawer } from '@/components/Drawer';
import { Game } from '@/components/Game';
import { Lobby } from '@/components/Lobby';
import { RoomJoinModal } from '@/components/RoomJoinModal';
import { useAuth } from '@/lib/useAuth';
import { useRoom } from '@/lib/useRoom';
import type { MatchResult } from '@/types';

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
  const { user, loading: authLoading } = useAuth();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [hasAttemptedJoin, setHasAttemptedJoin] = useState(false);

  const {
    room,
    loading,
    error,
    playerId,
    startGame,
    voteResult,
    updateScore,
    sendInvite,
    acceptInvite,
    declineInvite,
    leaveRoom,
    joinRoom,
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

  const handleUpdateScore = async (team: 'champions' | 'challengers', numVal: number) => {
    try {
      await updateScore(team, numVal);
    } catch (err) {
      console.error('Error incrementing score:', err);
    }
  };

  const handleJoinRoom = async () => {
    try {
      setHasAttemptedJoin(true);
      const success = await joinRoom(resolvedParams.code);
      if (success) {
        setShowJoinModal(false);
      }
    } catch (err) {
      console.error('Error joining room:', err);
      throw err; // Re-throw to show in modal
    }
  };

  const handleCancelJoin = () => {
    router.push('/');
  };

  // Check if user needs to join the room
  useEffect(() => {
    if (authLoading || loading) return;

    if (room) {
      if (!user) {
        // No user authenticated - show modal to auth and join
        if (!showJoinModal) {
          setShowJoinModal(true);
        }
      } else if (!room.players[user.uid] && !hasAttemptedJoin) {
        // User is authenticated but not in the room - show join modal
        if (!showJoinModal) {
          setShowJoinModal(true);
        }
      } else if (room.players[user.uid] && showJoinModal) {
        // User is already in the room - hide modal
        setShowJoinModal(false);
      }
    }
  }, [user, room, authLoading, loading, hasAttemptedJoin, showJoinModal]);

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

  // Show join modal if user needs to join
  if (showJoinModal && room) {
    return (
      <RoomJoinModal roomCode={room.code} onJoin={handleJoinRoom} onCancel={handleCancelJoin} />
    );
  }

  // Loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-[#101827] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎯</div>
          <p className="text-[#9198a0]">Завантаження...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !room) {
    return (
      <div className="min-h-screen bg-[#101827] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-xl font-semibold text-[#fef4e5]">{error || 'Кімнату не знайдено'}</h2>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[#75db70] text-[#101827] font-medium rounded-lg hover:bg-[#6bc965] focus:outline-none focus:ring-2 focus:ring-[#75db70] transition-colors"
          >
            Повернутися на головну
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101827]">
      {/* Header with drawer */}
      <div className="sticky top-0 z-10 bg-[#1e2939] border-b border-[#9198a0]/20 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <Drawer room={room} onLeaveRoom={handleLeaveRoom} onCopyRoomCode={handleCopyRoomCode} />
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold text-[#fef4e5]">{room.code}</h1>
            <p className="text-xs text-[#9198a0]">
              {Object.keys(room.players).length}{' '}
              {Object.keys(room.players).length === 1 ? 'гравець' : 'гравців'}
            </p>
          </div>
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>
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
        />
      ) : (
        <Game
          room={room}
          playerId={playerId}
          onVoteResult={handleVoteResult}
          onUpdateScore={handleUpdateScore}
        />
      )}
    </div>
  );
}
