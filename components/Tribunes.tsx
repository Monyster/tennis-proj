'use client';

import { Player, Team } from '@/types';

interface TribunesProps {
  queue: string[];
  bench: string[];
  players: Record<string, Player>;
  teams: Record<string, Team>;
}

/**
 * Displays queue and bench players as "tribunes" (spectators)
 * Queue shows teams waiting to play, bench shows individual players
 */
export default function Tribunes({ queue, bench, players, teams }: TribunesProps) {
  const queueTeams = queue.map((teamId) => teams[teamId]).filter(Boolean);
  const benchPlayers = bench.map((playerId) => players[playerId]).filter(Boolean);

  const PlayerMini = ({ player }: { player: Player }) => (
    <div className="flex flex-col items-center gap-1">
      {player.photoURL ? (
        <img
          src={player.photoURL}
          alt={player.name}
          className="h-8 w-8 rounded-full border border-gray-300"
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-gray-200 text-xs font-medium text-gray-600">
          {player.isAnonymous ? '?' : player.name[0]?.toUpperCase()}
        </div>
      )}
      <span className="text-[10px] text-gray-600 max-w-[50px] truncate">
        {player.name}
      </span>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto mt-4 space-y-3">
      {/* Queue - Waiting teams */}
      {queueTeams.length > 0 && (
        <div className="bg-gradient-to-b from-gray-100 to-gray-50 rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Черга ({queueTeams.length} {queueTeams.length === 1 ? 'команда' : 'команди'})
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {queueTeams.map((team) => {
              const player1 = players[team.player1Id];
              const player2 = players[team.player2Id];
              if (!player1 || !player2) return null;

              return (
                <div
                  key={team.id}
                  className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200"
                >
                  <PlayerMini player={player1} />
                  <div className="text-gray-400 text-xs">+</div>
                  <PlayerMini player={player2} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bench - Individual players */}
      {benchPlayers.length > 0 && (
        <div className="bg-gradient-to-b from-amber-50 to-orange-50 rounded-lg p-3 shadow-sm border border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
              Лава ({benchPlayers.length})
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {benchPlayers.map((player) => (
              <div
                key={player.id}
                className="bg-white px-3 py-2 rounded-lg shadow-sm border border-amber-200"
              >
                <PlayerMini player={player} />
              </div>
            ))}
          </div>
        </div>
      )}

      {queueTeams.length === 0 && benchPlayers.length === 0 && (
        <div className="text-center text-sm text-gray-400 py-4">
          Немає гравців у черзі або на лаві
        </div>
      )}
    </div>
  );
}
