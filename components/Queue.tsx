import { Team, Player } from '@/types';

interface QueueProps {
  queue: string[];
  teams: Record<string, Team>;
  players: Record<string, Player>;
}

/**
 * Display component for the queue of teams waiting to play
 */
export function Queue({ queue, teams, players }: QueueProps) {
  if (queue.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Черга ({queue.length})
      </h3>
      <div className="space-y-2">
        {queue.map((teamId, index) => {
          const team = teams[teamId];
          if (!team) return null;

          const player1 = players[team.player1Id];
          const player2 = players[team.player2Id];

          if (!player1 || !player2) return null;

          return (
            <div
              key={teamId}
              className="flex items-center gap-2 px-3 py-2 bg-white rounded border border-gray-200"
            >
              <span className="text-xs font-medium text-gray-500 w-6">
                {index + 1}.
              </span>
              <span className="text-sm text-gray-900">
                {player1.name} + {player2.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
