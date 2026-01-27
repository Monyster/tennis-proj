import type { MatchResult, Vote } from '@/types';
import { VOTE_THRESHOLD } from '@/types';

/**
 * Result of vote processing
 */
export interface VotingUpdate {
  shouldProcess: boolean;
  newVoters: Record<string, boolean>;
  pendingResult: MatchResult | null;
}

/**
 * Process a vote for match result
 * Determines if threshold is met and match should be processed
 *
 * @param currentVotes - Current voting state
 * @param newVote - Result being voted for ('champions' or 'challengers')
 * @param voterId - ID of player voting
 * @param totalPlayers - Total number of players in the room
 * @returns VotingUpdate with whether to process and updated voter list
 */
export function processVote(
  currentVotes: Vote,
  newVote: MatchResult,
  voterId: string,
  totalPlayers: number,
): VotingUpdate {
  const requiredVotes = Math.ceil(totalPlayers * VOTE_THRESHOLD);

  let voters = { ...currentVotes.voters };

  // If voting for different result, reset votes
  if (currentVotes.pendingResult !== newVote) {
    voters = { [voterId]: true };
  } else {
    // Add vote to existing
    voters[voterId] = true;
  }

  const voteCount = Object.keys(voters).length;
  const shouldProcess = voteCount >= requiredVotes;

  return {
    shouldProcess,
    newVoters: voters,
    pendingResult: newVote,
  };
}

/**
 * Calculate required votes for threshold
 *
 * @param totalPlayers - Total number of players
 * @returns Number of votes required
 */
export function calculateRequiredVotes(totalPlayers: number): number {
  return Math.ceil(totalPlayers * VOTE_THRESHOLD);
}

/**
 * Get vote progress text for display
 *
 * @param currentVotes - Number of current votes
 * @param requiredVotes - Number of required votes
 * @param result - Which result is being voted for
 * @returns Display text (e.g., "Голосів: 2/4 за чемпіонів")
 */
export function getVoteProgressText(
  currentVotes: number,
  requiredVotes: number,
  result: MatchResult | null,
): string {
  if (!result) return '';

  const teamText = result === 'champions' ? 'чемпіонів' : 'претендентів';
  return `Голосів: ${currentVotes}/${requiredVotes} за ${teamText}`;
}
