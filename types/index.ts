// Core domain models
export interface Player {
  id: string; // Firebase Auth UID
  name: string;
  photoURL?: string; // Google profile photo
  isAnonymous: boolean; // true for guest users
  joinedAt: number;
  gamesPlayed: number;
  satOutLast: number;
  wins: number;
  losses: number;
}

export interface Team {
  id: string;
  player1Id: string;
  player2Id: string;
}

export interface Match {
  championsTeamId: string;
  challengersTeamId: string;
  championWinStreak: number;
  servingTeam: 'champions' | 'challengers';
  championsScore: number;
  challengersScore: number;
}

export interface Vote {
  pendingResult: 'champions' | 'challengers' | null;
  voters: Record<string, boolean>;
  startedAt: number | null;
}

export interface Invite {
  fromPlayerId: string;
  toPlayerId: string;
  createdAt: number;
}

export interface InviteWithId extends Invite {
  id: string;
}

export interface Room {
  code: string;
  status: 'lobby' | 'playing';
  createdAt: number;
  hostId: string;
  players: Record<string, Player>;
  teams: Record<string, Team>;
  match: Match | null;
  queue: string[];
  bench: string[];
  votes: Vote;
  invites: Record<string, Invite>;
}

// Constants
export const WINNING_SCORE = 11;
export const MIN_PLAYERS = 4;
export const VOTE_THRESHOLD = 0.3; // 30%

// Helper functions
export function getHandicap(winStreak: number): number {
  return winStreak * 2;
}

export function getServingTeam(winStreak: number): 'champions' | 'challengers' {
  if (winStreak === 0) return 'champions';
  return winStreak % 2 === 1 ? 'champions' : 'challengers';
}

// Utility types for better type safety
export type RoomStatus = Room['status'];
export type MatchResult = 'champions' | 'challengers';
export type ServingTeam = Match['servingTeam'];

// Domain logic helpers
export interface PlayerWithTeam extends Player {
  teamId?: string;
  partnerId?: string;
}

export interface TeamWithPlayers extends Team {
  player1: Player;
  player2: Player;
}

// Hook return types
export interface UseRoomResult {
  room: Room | null;
  loading: boolean;
  error: string | null;
  playerId: string;
  currentPlayer: Player | null;
  pendingInvites: InviteWithId[];

  // Actions (uses Firebase Auth displayName or generated name automatically)
  createRoom: () => Promise<string>;
  joinRoom: (code: string) => Promise<boolean>;
  leaveRoom: () => Promise<void>;
  sendInvite: (toPlayerId: string) => Promise<void>;
  acceptInvite: (inviteId: string) => Promise<void>;
  declineInvite: (inviteId: string) => Promise<void>;
  startGame: () => Promise<void>;
  voteResult: (result: MatchResult) => Promise<void>;
  incrementScore: (team: 'champions' | 'challengers') => Promise<void>;
}

// Rotation logic types
export interface RotationDecision {
  stays: string;
  leaves: string;
}
