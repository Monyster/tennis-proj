import { nanoid } from 'nanoid';
import { Player, Team, RotationDecision, getServingTeam } from '@/types';

/**
 * Generate a unique room code in format PING-XXXX
 * where XXXX is a 4-digit number
 */
export function generateRoomCode(): string {
  const numbers = Math.floor(1000 + Math.random() * 9000);
  return `PING-${numbers}`;
}

/**
 * Get or create player ID from localStorage
 * Uses nanoid for unique, URL-safe identifiers
 */
export function getPlayerId(): string {
  if (typeof window === 'undefined') {
    return ''; // Server-side rendering guard
  }

  let id = localStorage.getItem('playerId');
  if (!id) {
    id = nanoid(10);
    localStorage.setItem('playerId', id);
  }
  return id;
}

/**
 * Get player name from localStorage
 */
export function getPlayerName(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('playerName');
}

/**
 * Save player name to localStorage
 */
export function setPlayerName(name: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem('playerName', name);
}

/**
 * Generate a unique team ID
 */
export function generateTeamId(): string {
  return nanoid(8);
}

/**
 * Generate a unique invite ID
 */
export function generateInviteId(): string {
  return nanoid(8);
}

/**
 * Normalize room code to uppercase and remove spaces
 */
export function normalizeRoomCode(code: string): string {
  return code.toUpperCase().trim();
}

/**
 * Validate room code format (PING-XXXX)
 */
export function isValidRoomCode(code: string): boolean {
  const normalized = normalizeRoomCode(code);
  return /^PING-\d{4}$/.test(normalized);
}

/**
 * Determine which player stays on the table in odd player count scenario
 * Player who has played fewer games stays
 * If equal, use satOutLast timestamp (who sat out earlier stays)
 */
export function whoStays(
  team: Team,
  players: Record<string, Player>
): RotationDecision {
  const p1 = players[team.player1Id];
  const p2 = players[team.player2Id];

  if (!p1 || !p2) {
    throw new Error('Invalid team: missing player data');
  }

  // Primary criterion: fewer games played
  if (p1.gamesPlayed < p2.gamesPlayed) {
    return { stays: team.player1Id, leaves: team.player2Id };
  }
  if (p2.gamesPlayed < p1.gamesPlayed) {
    return { stays: team.player2Id, leaves: team.player1Id };
  }

  // Secondary criterion: who sat out earlier (lower timestamp)
  if (p1.satOutLast < p2.satOutLast) {
    return { stays: team.player1Id, leaves: team.player2Id };
  }

  return { stays: team.player2Id, leaves: team.player1Id };
}

/**
 * Shuffle array using Fisher-Yates algorithm
 * Used for initial random team formation
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Create random teams from a list of player IDs
 * Returns array of teams and array of bench player IDs (if odd count)
 */
export interface TeamFormationResult {
  teams: Team[];
  bench: string[];
}

export function createRandomTeams(playerIds: string[]): TeamFormationResult {
  if (playerIds.length < 4) {
    throw new Error('Minimum 4 players required');
  }

  const shuffled = shuffleArray(playerIds);
  const teams: Team[] = [];
  const bench: string[] = [];

  // If odd number of players, last one goes to bench
  const playersToTeam = shuffled.length % 2 === 0
    ? shuffled
    : shuffled.slice(0, -1);

  if (shuffled.length % 2 === 1) {
    bench.push(shuffled[shuffled.length - 1]);
  }

  // Create teams of 2
  for (let i = 0; i < playersToTeam.length; i += 2) {
    teams.push({
      id: generateTeamId(),
      player1Id: playersToTeam[i],
      player2Id: playersToTeam[i + 1],
    });
  }

  return { teams, bench };
}

/**
 * Calculate win percentage for stats display
 */
export function calculateWinPercentage(wins: number, losses: number): number {
  const total = wins + losses;
  if (total === 0) return 0;
  return Math.round((wins / total) * 100);
}

/**
 * Format timestamp to readable date/time
 */
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get the handicap text for display
 */
export function getHandicapText(winStreak: number): string {
  const handicap = winStreak * 2;
  return handicap > 0 ? `+${handicap}` : '0';
}

/**
 * Get the serving team text for display
 */
export function getServingTeamText(winStreak: number): string {
  if (winStreak === 0) return 'Чемпіони подають першими';

  const servingTeam = getServingTeam(winStreak);
  return servingTeam === 'champions'
    ? 'Подають чемпіони'
    : 'Подають претенденти';
}

/**
 * Check if player is in a team
 */
export function isPlayerInTeam(
  playerId: string,
  teamId: string,
  teams: Record<string, Team> | null | undefined
): boolean {
  if (!teams) return false;
  const team = teams[teamId];
  if (!team) return false;
  return team.player1Id === playerId || team.player2Id === playerId;
}

/**
 * Find team ID for a given player
 */
export function findPlayerTeam(
  playerId: string,
  teams: Record<string, Team> | null | undefined
): string | null {
  if (!teams) return null;

  for (const [teamId, team] of Object.entries(teams)) {
    if (team.player1Id === playerId || team.player2Id === playerId) {
      return teamId;
    }
  }
  return null;
}

/**
 * Get partner ID for a player in a team
 */
export function getPartnerId(
  playerId: string,
  team: Team
): string | null {
  if (team.player1Id === playerId) return team.player2Id;
  if (team.player2Id === playerId) return team.player1Id;
  return null;
}
