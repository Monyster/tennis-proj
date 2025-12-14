import { Player } from '@/types';

interface BenchProps {
  bench: string[];
  players: Record<string, Player>;
}

/**
 * Display component for players sitting on the bench (odd player count)
 */
export function Bench({ bench, players }: BenchProps) {
  if (bench.length === 0) {
    return null;
  }

  return (
    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
      <h3 className="text-sm font-semibold text-orange-700 mb-3">
        На лаві
      </h3>
      <div className="space-y-2">
        {bench.map((playerId) => {
          const player = players[playerId];
          if (!player) return null;

          return (
            <div
              key={playerId}
              className="px-3 py-2 bg-white rounded border border-orange-200"
            >
              <p className="text-sm font-medium text-gray-900">
                {player.name}
              </p>
              <p className="text-xs text-gray-600">
                Зіграв ігор: {player.gamesPlayed}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
