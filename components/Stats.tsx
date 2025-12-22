'use client';

import { Player } from '@/types';
import { calculateWinPercentage } from '@/lib/utils';

interface StatsProps {
  players: Record<string, Player>;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Stats modal showing all players' game statistics
 * Sorted by win percentage
 */
export function Stats({ players, isOpen, onClose }: StatsProps) {
  if (!isOpen) {
    return null;
  }

  const sortedPlayers = Object.values(players).sort((a, b) => {
    const aWinRate = calculateWinPercentage(a.wins, a.losses);
    const bWinRate = calculateWinPercentage(b.wins, b.losses);

    if (aWinRate !== bWinRate) {
      return bWinRate - aWinRate;
    }

    return b.wins - a.wins;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Статистика гравців
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Гравець
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Ігор
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Перемоги
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Поразки
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Win%
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedPlayers.map((player, index) => {
                const winPercentage = calculateWinPercentage(player.wins, player.losses);
                const totalGames = player.wins + player.losses;

                return (
                  <tr
                    key={player.id}
                    className={`${
                      index === 0 && totalGames > 0
                        ? 'bg-orange-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {index === 0 && totalGames > 0 && (
                          <span className="text-xs font-bold text-orange-600 uppercase">Лідер</span>
                        )}
                        <span className="font-medium text-gray-900">
                          {player.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700">
                      {player.gamesPlayed}
                    </td>
                    <td className="px-4 py-3 text-center text-success-600 font-medium">
                      {player.wins}
                    </td>
                    <td className="px-4 py-3 text-center text-error-600 font-medium">
                      {player.losses}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`font-semibold ${
                          winPercentage >= 60
                            ? 'text-success-600'
                            : winPercentage >= 40
                            ? 'text-gray-700'
                            : 'text-error-600'
                        }`}
                      >
                        {totalGames > 0 ? `${winPercentage}%` : '-'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sortedPlayers.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            Статистика ще не доступна
          </p>
        )}
      </div>
    </div>
  );
}
