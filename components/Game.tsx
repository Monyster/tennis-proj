'use client';

import { type MatchResult, type Room, VOTE_THRESHOLD } from '@/types';
import TableView from './TableView';
import Tribunes from './Tribunes';
import { VoteButtons } from './VoteButtons';

interface GameProps {
  room: Room;
  playerId: string;
  onVoteResult: (result: MatchResult) => void;
  onUpdateScore: (team: 'champions' | 'challengers', addVal: number) => void;
}

/**
 * Game component - displays active match with table visualization
 */
export function Game({ room, playerId, onVoteResult, onUpdateScore }: GameProps) {
  if (!room.match) {
    return (
      <div className="min-h-screen bg-[#101827] p-4">
        <p className="text-center text-[#9198a0] mt-20">Матч не активний</p>
      </div>
    );
  }

  const championsTeam = room.teams?.[room.match.championsTeamId];
  const challengersTeam = room.teams?.[room.match.challengersTeamId];

  if (!championsTeam || !challengersTeam) {
    return (
      <div className="min-h-screen bg-[#101827] p-4">
        <p className="text-center text-error-500 mt-20">Помилка: команди не знайдено</p>
      </div>
    );
  }

  const totalPlayers = Object.keys(room.players).length;
  const requiredVotes = Math.ceil(totalPlayers * VOTE_THRESHOLD);
  const hasVoted = room.votes?.voters?.[playerId] === true;

  return (
    <div className="min-h-screen bg-[#101827]">
      {/* Main Content */}
      <div className="pb-6">
        {/* Table Visualization */}
        <TableView
          championsTeam={championsTeam}
          challengersTeam={challengersTeam}
          players={room.players}
          match={room.match}
          onUpdateScore={onUpdateScore}
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
    </div>
  );
}
