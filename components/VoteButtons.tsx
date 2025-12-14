'use client';

import { MatchResult, Vote } from '@/types';

interface VoteButtonsProps {
  votes: Vote;
  requiredVotes: number;
  onVote: (result: MatchResult) => void;
  hasVoted: boolean;
}

/**
 * Voting buttons for match results
 * Shows vote progress and handles voting logic
 */
export function VoteButtons({
  votes,
  requiredVotes,
  onVote,
  hasVoted,
}: VoteButtonsProps) {
  const voteCount = Object.keys(votes.voters).length;
  const championsVoting = votes.pendingResult === 'champions';
  const challengersVoting = votes.pendingResult === 'challengers';

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 text-center">
        Хто переміг?
      </h3>

      <div className="flex gap-4">
        <button
          onClick={() => onVote('champions')}
          disabled={hasVoted && championsVoting}
          className={`flex-1 px-6 py-4 rounded-lg font-medium transition-all ${
            championsVoting
              ? 'bg-yellow-600 text-white border-2 border-yellow-700'
              : 'bg-yellow-100 text-yellow-900 hover:bg-yellow-200 border-2 border-yellow-300'
          } disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2`}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl">🏆</span>
            <span>Чемпіони</span>
            {championsVoting && (
              <span className="text-sm">
                {voteCount}/{requiredVotes}
              </span>
            )}
          </div>
        </button>

        <button
          onClick={() => onVote('challengers')}
          disabled={hasVoted && challengersVoting}
          className={`flex-1 px-6 py-4 rounded-lg font-medium transition-all ${
            challengersVoting
              ? 'bg-blue-600 text-white border-2 border-blue-700'
              : 'bg-blue-100 text-blue-900 hover:bg-blue-200 border-2 border-blue-300'
          } disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl">🎯</span>
            <span>Претенденти</span>
            {challengersVoting && (
              <span className="text-sm">
                {voteCount}/{requiredVotes}
              </span>
            )}
          </div>
        </button>
      </div>

      {votes.pendingResult && (
        <div className="text-center text-sm text-gray-600">
          Голосів: {voteCount} з {requiredVotes} необхідних
          {hasVoted && (
            <span className="ml-2 text-green-600 font-medium">✓ Ви проголосували</span>
          )}
        </div>
      )}
    </div>
  );
}
