'use client';

import { Player, Team, Match } from '@/types';

interface TableViewProps {
  championsTeam: Team;
  challengersTeam: Team;
  players: Record<string, Player>;
  match: Match;
  onIncrementScore: (team: 'champions' | 'challengers') => void;
}

/**
 * Table tennis table visualization (top-down view)
 * Shows players positioned around the table with scores
 */
export default function TableView({
  championsTeam,
  challengersTeam,
  players,
  match,
  onIncrementScore,
}: TableViewProps) {
  const champion1 = players[championsTeam.player1Id];
  const champion2 = players[championsTeam.player2Id];
  const challenger1 = players[challengersTeam.player1Id];
  const challenger2 = players[challengersTeam.player2Id];

  const handicap = match.championWinStreak * 2;

  // Calculate total scores for serving logic
  const totalPoints = match.championsScore + match.challengersScore;
  const isDeuce = (match.championsScore >= 10 && match.challengersScore >= 10);

  // Determine who serves based on table tennis doubles rules with diagonal rotation
  // Points 0-1: Champion 1 serves (2 serves)
  // Points 2-3: Challenger 2 serves (2 serves, diagonal)
  // Points 4-5: Champion 2 serves (2 serves, diagonal)
  // Points 6-7: Challenger 1 serves (2 serves, diagonal)
  // Then repeat from Champion 1

  const servingRotation = Math.floor(totalPoints / 2) % 4; // 0,1,2,3 cycle

  // Map rotation to team and player
  // 0 = Champion 1, 1 = Challenger 2, 2 = Champion 2, 3 = Challenger 1
  let isChampionsServing: boolean;
  let championServingPlayerIndex: number;
  let challengerServingPlayerIndex: number;

  if (servingRotation === 0) {
    isChampionsServing = true;
    championServingPlayerIndex = 0; // Champion 1
    challengerServingPlayerIndex = 0; // unused
  } else if (servingRotation === 1) {
    isChampionsServing = false;
    championServingPlayerIndex = 0; // unused
    challengerServingPlayerIndex = 1; // Challenger 2
  } else if (servingRotation === 2) {
    isChampionsServing = true;
    championServingPlayerIndex = 1; // Champion 2
    challengerServingPlayerIndex = 0; // unused
  } else { // servingRotation === 3
    isChampionsServing = false;
    championServingPlayerIndex = 0; // unused
    challengerServingPlayerIndex = 0; // Challenger 1
  }

  const PlayerAvatar = ({
    player,
    isServing
  }: {
    player: Player;
    isServing: boolean;
  }) => (
    <div className="flex flex-col items-center gap-1 relative">
      {isServing && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-orange-400 text-orange-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10 whitespace-nowrap">
          ПОДАЄ
        </div>
      )}
      {player.photoURL ? (
        <img
          src={player.photoURL}
          alt={player.name}
          className={`h-12 w-12 rounded-full border-2 shadow-md ${
            isServing ? 'border-orange-400 ring-2 ring-orange-300' : 'border-white'
          }`}
        />
      ) : (
        <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-md text-sm font-medium ${
          isServing
            ? 'border-orange-400 ring-2 ring-orange-300 bg-orange-100 text-orange-900'
            : 'border-white bg-gray-300 text-gray-700'
        }`}>
          {player.isAnonymous ? '?' : player.name[0]?.toUpperCase()}
        </div>
      )}
      <span className="text-xs font-medium text-gray-700 max-w-[70px] truncate text-center">
        {player.name}
      </span>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto p-4">
      {/* Scoreboard */}
      <div className="mb-4 bg-gray-900 rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          {/* Champions Score */}
          <div className="flex-1 text-center">
            <div className="text-xs text-orange-300 mb-1 font-semibold">
              ЧЕМПІОНИ {match.championWinStreak > 0 && `(${match.championWinStreak})`}
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => onIncrementScore('champions')}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full h-8 w-8 flex items-center justify-center shadow-md transition"
              >
                +
              </button>
              <div className="text-5xl font-bold text-white tabular-nums">
                {match.championsScore}
              </div>
            </div>
            {handicap > 0 && (
              <div className="text-xs text-gray-400 mt-1">
                Фора претендентів: +{handicap}
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="text-3xl text-gray-500 font-thin">:</div>

          {/* Challengers Score */}
          <div className="flex-1 text-center">
            <div className="text-xs text-blue-300 mb-1 font-semibold">
              ПРЕТЕНДЕНТИ
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="text-5xl font-bold text-white tabular-nums">
                {match.challengersScore + handicap}
              </div>
              <button
                onClick={() => onIncrementScore('challengers')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full h-8 w-8 flex items-center justify-center shadow-md transition"
              >
                +
              </button>
            </div>
            {handicap > 0 && (
              <div className="text-xs text-gray-400 mt-1">
                Без фори: {match.challengersScore}
              </div>
            )}
          </div>
        </div>

        {/* Serving indicator */}
        <div className="mt-3 text-center text-xs text-gray-400">
          {match.servingTeam === 'champions' ? 'Подають чемпіони' : 'Подають претенденти'}
        </div>
      </div>

      {/* Table View */}
      <div className="relative bg-green-700 rounded-2xl p-6 shadow-2xl mt-20">
        {/* Table surface */}
        <div className="relative bg-green-600 rounded-xl p-4 border-4 border-white">
          {/* Net */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-white"></div>
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
            <div className="flex justify-center">
              <div className="h-8 w-1 bg-white"></div>
            </div>
          </div>

          {/* Table markings */}
          <div className="h-48 flex items-center justify-center text-white/20 text-xs">
            <div className="absolute inset-4 border-2 border-white/20 rounded-lg"></div>
          </div>
        </div>

        {/* Player positions */}
        {/* Champions - Top side (orange) */}
        <div className="absolute -top-20 left-1/4 -translate-x-1/2">
          <div className="bg-orange-100 px-3 py-2 rounded-lg shadow-md">
            <PlayerAvatar
              player={champion1}
              isServing={isChampionsServing && championServingPlayerIndex === 0}
            />
          </div>
        </div>
        <div className="absolute -top-20 right-1/4 translate-x-1/2">
          <div className="bg-orange-100 px-3 py-2 rounded-lg shadow-md">
            <PlayerAvatar
              player={champion2}
              isServing={isChampionsServing && championServingPlayerIndex === 1}
            />
          </div>
        </div>

        {/* Challengers - Bottom side (blue) */}
        <div className="absolute -bottom-20 left-1/4 -translate-x-1/2">
          <div className="bg-blue-100 px-3 py-2 rounded-lg shadow-md">
            <PlayerAvatar
              player={challenger1}
              isServing={!isChampionsServing && challengerServingPlayerIndex === 0}
            />
          </div>
        </div>
        <div className="absolute -bottom-20 right-1/4 translate-x-1/2">
          <div className="bg-blue-100 px-3 py-2 rounded-lg shadow-md">
            <PlayerAvatar
              player={challenger2}
              isServing={!isChampionsServing && challengerServingPlayerIndex === 1}
            />
          </div>
        </div>
      </div>

      {/* Add bottom spacing for player cards */}
      <div className="h-24"></div>
    </div>
  );
}
