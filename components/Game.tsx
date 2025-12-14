'use client';

import { useState } from 'react';
import { Room, MatchResult, VOTE_THRESHOLD, getHandicap } from '@/types';
import { TeamCard } from './TeamCard';
import { VoteButtons } from './VoteButtons';
import { Queue } from './Queue';
import { Bench } from './Bench';
import { Stats } from './Stats';

interface GameProps {
  room: Room;
  playerId: string;
  onVoteResult: (result: MatchResult) => void;
  onCopyRoomCode: () => void;
}

/**
 * Game component - displays active match and allows voting
 */
export function Game({ room, playerId, onVoteResult, onCopyRoomCode }: GameProps) {
  const [showStats, setShowStats] = useState(false);

  if (!room.match) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-center text-gray-600">Матч не активний</p>
      </div>
    );
  }

  const championsTeam = room.teams?.[room.match.championsTeamId];
  const challengersTeam = room.teams?.[room.match.challengersTeamId];

  if (!championsTeam || !challengersTeam) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-center text-red-600">Помилка: команди не знайдено</p>
      </div>
    );
  }

  const handicap = getHandicap(room.match.championWinStreak);
  const totalPlayers = Object.keys(room.players).length;
  const requiredVotes = Math.ceil(totalPlayers * VOTE_THRESHOLD);
  const hasVoted = room.votes?.voters?.[playerId] === true;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{room.code}</h1>
            <p className="text-sm text-gray-600">
              Гравців: {totalPlayers}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowStats(true)}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
            >
              📊 Статистика
            </button>
            <button
              onClick={onCopyRoomCode}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
            >
              Копіювати
            </button>
          </div>
        </div>
      </div>

      {/* Champions Team */}
      <TeamCard
        team={championsTeam}
        players={room.players}
        variant="champions"
        winStreak={room.match.championWinStreak}
      />

      {/* VS Divider */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
          <span className="text-2xl font-bold text-gray-600">VS</span>
        </div>
      </div>

      {/* Challengers Team */}
      <TeamCard
        team={challengersTeam}
        players={room.players}
        variant="challengers"
        handicap={handicap}
        servingTeam={room.match.servingTeam === 'challengers'}
      />

      {/* Voting */}
      <div className="bg-white rounded-lg shadow p-6">
        <VoteButtons
          votes={room.votes}
          requiredVotes={requiredVotes}
          onVote={onVoteResult}
          hasVoted={hasVoted}
        />
      </div>

      {/* Queue and Bench */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {room.queue.length > 0 && (
          <Queue
            queue={room.queue}
            teams={room.teams || {}}
            players={room.players}
          />
        )}
        {room.bench.length > 0 && (
          <Bench bench={room.bench} players={room.players} />
        )}
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
