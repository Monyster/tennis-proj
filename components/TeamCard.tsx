import { Team, Player } from '@/types';

interface TeamCardProps {
  team: Team;
  players: Record<string, Player>;
  variant?: 'default' | 'champions' | 'challengers';
  handicap?: number;
  servingTeam?: boolean;
  winStreak?: number;
}

/**
 * Display component for a team
 * Shows both players with optional game state indicators
 */
export function TeamCard({
  team,
  players,
  variant = 'default',
  handicap,
  servingTeam,
  winStreak,
}: TeamCardProps) {
  const player1 = players[team.player1Id];
  const player2 = players[team.player2Id];

  if (!player1 || !player2) {
    return null;
  }

  const variantStyles = {
    default: 'bg-white border-gray-300',
    champions: 'bg-orange-50 border-orange-500',
    challengers: 'bg-blue-50 border-blue-500',
  };

  const titleStyles = {
    default: 'text-gray-700',
    champions: 'text-orange-700',
    challengers: 'text-blue-700',
  };

  return (
    <div
      className={`px-6 py-4 rounded-lg border-2 ${variantStyles[variant]}`}
    >
      {variant !== 'default' && (
        <div className={`text-sm font-semibold mb-2 ${titleStyles[variant]}`}>
          {variant === 'champions' && 'ЧЕМПІОНИ'}
          {variant === 'challengers' && 'ПРЕТЕНДЕНТИ'}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="font-medium text-lg text-gray-900">
            {player1.name}
          </span>
          <span className="text-gray-400">+</span>
          <span className="font-medium text-lg text-gray-900">
            {player2.name}
          </span>
        </div>

        {variant === 'champions' && winStreak !== undefined && winStreak > 0 && (
          <p className="text-sm text-center text-orange-700">
            Серія перемог: {winStreak}
          </p>
        )}

        {variant === 'challengers' && (handicap !== undefined || servingTeam !== undefined) && (
          <div className="text-sm text-center space-y-1">
            {handicap !== undefined && handicap > 0 && (
              <p className="text-blue-700">Фора: +{handicap}</p>
            )}
            {servingTeam !== undefined && (
              <p className="text-blue-700">
                {servingTeam ? 'Подають вони' : 'Подають чемпіони'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
