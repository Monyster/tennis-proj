'use client';

import { useState } from 'react';
import { Room, MatchResult, VOTE_THRESHOLD } from '@/types';
import { VoteButtons } from './VoteButtons';
import { Stats } from './Stats';
import TableView from './TableView';
import Tribunes from './Tribunes';
import UserProfile from './UserProfile';

interface GameProps {
  room: Room;
  playerId: string;
  onVoteResult: (result: MatchResult) => void;
  onIncrementScore: (team: 'champions' | 'challengers') => void;
  onCopyRoomCode: () => void;
}

/**
 * Game component - displays active match with table visualization
 */
export function Game({
  room,
  playerId,
  onVoteResult,
  onIncrementScore,
  onCopyRoomCode
}: GameProps) {
  const [showStats, setShowStats] = useState(false);

  if (!room.match) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
        <p className="text-center text-gray-600 mt-20">Матч не активний</p>
      </div>
    );
  }

  const championsTeam = room.teams?.[room.match.championsTeamId];
  const challengersTeam = room.teams?.[room.match.challengersTeamId];

  if (!championsTeam || !challengersTeam) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
        <p className="text-center text-red-600 mt-20">Помилка: команди не знайдено</p>
      </div>
    );
  }

  const totalPlayers = Object.keys(room.players).length;
  const requiredVotes = Math.ceil(totalPlayers * VOTE_THRESHOLD);
  const hasVoted = room.votes?.voters?.[playerId] === true;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{room.code}</h1>
            <p className="text-xs text-gray-600">
              {totalPlayers} {totalPlayers === 1 ? 'гравець' : 'гравців'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStats(true)}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              aria-label="Статистика"
            >
              📊
            </button>
            <button
              onClick={onCopyRoomCode}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              aria-label="Копіювати код"
            >
              📋
            </button>
            <UserProfile />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-6">
        {/* Table Visualization */}
        <TableView
          championsTeam={championsTeam}
          challengersTeam={challengersTeam}
          players={room.players}
          match={room.match}
          onIncrementScore={onIncrementScore}
        />

        {/* Tribunes (Queue & Bench) */}
        <Tribunes
          queue={room.queue}
          bench={room.bench}
          players={room.players}
          teams={room.teams || {}}
        />

        {/* Voting Section */}
        <div className="max-w-md mx-auto px-4 mt-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-sm text-gray-600 mb-3 text-center">
              Якщо рахунок неправильний, проголосуйте за переможця:
            </div>
            <VoteButtons
              votes={room.votes}
              requiredVotes={requiredVotes}
              onVote={onVoteResult}
              hasVoted={hasVoted}
            />
          </div>
        </div>
      </div>

      {/* Stats Modal */}
      <Stats
        players={room.players}
        isOpen={showStats}
        onClose={() => setShowStats(false)}
      />
    </div>
  );
}
