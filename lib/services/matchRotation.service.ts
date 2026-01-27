import type { Match, MatchResult, Player, Room, Team } from '@/types';
import { getServingTeam } from '@/types';
import { whoStays } from '../utils';

/**
 * Result of match rotation calculation
 * Contains all state changes needed after a match completes
 */
export interface RotationResult {
  newMatch: Match;
  playerUpdates: Record<string, Partial<Player>>;
  teamUpdates: Record<string, Team>;
  newQueue: string[];
  newBench: string[];
}

/**
 * Calculate match rotation after a game completes
 * Implements the complex rotation logic for champions staying/leaving
 * Handles both even and odd player counts
 *
 * @param currentRoom - Current room state
 * @param winner - Which team won ('champions' or 'challengers')
 * @param generateTeamId - Function to generate new team IDs
 * @returns RotationResult with all state changes
 */
export function calculateMatchRotation(
  currentRoom: Room,
  winner: MatchResult,
  generateTeamId: () => string,
): RotationResult {
  if (!currentRoom.match) {
    throw new Error('No active match to rotate');
  }

  const championsTeam = currentRoom.teams[currentRoom.match.championsTeamId];
  const challengersTeam = currentRoom.teams[currentRoom.match.challengersTeamId];

  if (!championsTeam || !challengersTeam) {
    throw new Error('Teams not found');
  }

  const playerCount = Object.keys(currentRoom.players).length;
  const isOdd = playerCount % 2 === 1;

  // Prepare player stat updates
  const playerUpdates: Record<string, Partial<Player>> = {};
  const winningTeam = winner === 'champions' ? championsTeam : challengersTeam;
  const losingTeam = winner === 'champions' ? challengersTeam : championsTeam;

  // Update winner stats
  [winningTeam.player1Id, winningTeam.player2Id].forEach((playerId) => {
    const player = currentRoom.players[playerId];
    playerUpdates[playerId] = {
      wins: (player.wins || 0) + 1,
      gamesPlayed: (player.gamesPlayed || 0) + 1,
    };
  });

  // Update loser stats
  [losingTeam.player1Id, losingTeam.player2Id].forEach((playerId) => {
    const player = currentRoom.players[playerId];
    playerUpdates[playerId] = {
      losses: (player.losses || 0) + 1,
      gamesPlayed: (player.gamesPlayed || 0) + 1,
    };
  });

  let newChampionsTeamId: string;
  let newChallengersTeamId: string;
  let newWinStreak: number;
  let newQueue = [...currentRoom.queue];
  let newBench = [...currentRoom.bench];
  const teamUpdates: Record<string, Team> = {};

  if (winner === 'champions') {
    // Champions win: they stay, increase win streak
    newChampionsTeamId = championsTeam.id;
    newWinStreak = currentRoom.match.championWinStreak + 1;

    if (isOdd && newBench.length > 0) {
      // Odd count: one challenger stays, one goes to bench
      const decision = whoStays(challengersTeam, currentRoom.players);
      const playerFromBench = newBench[0];

      // Player who leaves goes to bench
      playerUpdates[decision.leaves] = {
        ...playerUpdates[decision.leaves],
        satOutLast: Date.now(),
      };
      newBench = [decision.leaves];

      // Create new team: player who stays + player from bench
      const newTeamId = generateTeamId();
      const newTeam: Team = {
        id: newTeamId,
        player1Id: decision.stays,
        player2Id: playerFromBench,
      };
      teamUpdates[newTeamId] = newTeam;
      newChallengersTeamId = newTeamId;
    } else {
      // Even count: losers go to queue end, new challengers from queue
      newQueue = [...newQueue, challengersTeam.id];
      const nextTeamId = newQueue.shift();
      if (!nextTeamId) {
        throw new Error('No teams in queue');
      }
      newChallengersTeamId = nextTeamId;
    }
  } else {
    // Challengers win: they become champions, win streak resets
    newChampionsTeamId = challengersTeam.id;
    newWinStreak = 0;

    if (isOdd && newBench.length > 0) {
      // Odd count: one ex-champion stays, one goes to bench
      const decision = whoStays(championsTeam, currentRoom.players);
      const playerFromBench = newBench[0];

      // Player who leaves goes to bench
      playerUpdates[decision.leaves] = {
        ...playerUpdates[decision.leaves],
        satOutLast: Date.now(),
      };
      newBench = [decision.leaves];

      // Create new team: player who stays + player from bench
      const newTeamId = generateTeamId();
      const newTeam: Team = {
        id: newTeamId,
        player1Id: decision.stays,
        player2Id: playerFromBench,
      };
      teamUpdates[newTeamId] = newTeam;
      newChallengersTeamId = newTeamId;
    } else {
      // Even count: ex-champions go to queue end
      newQueue = [...newQueue, championsTeam.id];
      const nextTeamId = newQueue.shift();
      if (!nextTeamId) {
        throw new Error('No teams in queue');
      }
      newChallengersTeamId = nextTeamId;
    }
  }

  // Create new match with updated teams and win streak
  const newServingTeam = getServingTeam(newWinStreak);
  const newMatch: Match = {
    championsTeamId: newChampionsTeamId,
    challengersTeamId: newChallengersTeamId,
    championWinStreak: newWinStreak,
    servingTeam: newServingTeam,
    championsScore: 0,
    challengersScore: 0,
  };

  return {
    newMatch,
    playerUpdates,
    teamUpdates,
    newQueue,
    newBench,
  };
}
