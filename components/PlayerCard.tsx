import { Player } from '@/types';

interface PlayerCardProps {
  player: Player;
  isCurrentPlayer?: boolean;
  onInvite?: () => void;
  showInviteButton?: boolean;
}

/**
 * Display component for a single player
 * Shows player info with optional invite button
 */
export function PlayerCard({
  player,
  isCurrentPlayer = false,
  onInvite,
  showInviteButton = false,
}: PlayerCardProps) {
  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${
        isCurrentPlayer
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 bg-white'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-900">
            {player.name}
            {isCurrentPlayer && (
              <span className="ml-2 text-xs text-blue-600">(ти)</span>
            )}
          </p>
          <p className="text-sm text-gray-600">
            Ігор: {player.gamesPlayed} | В: {player.wins} | П: {player.losses}
          </p>
        </div>

        {showInviteButton && onInvite && !isCurrentPlayer && (
          <button
            onClick={onInvite}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Запросити
          </button>
        )}
      </div>
    </div>
  );
}
