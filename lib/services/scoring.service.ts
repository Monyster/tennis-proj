import type { Match, MatchResult } from '@/types';
import { WINNING_SCORE } from '@/types';
import { clamp } from '../utils';

/**
 * Result of score update calculation
 */
export interface ScoringUpdate {
  championsScore: number;
  challengersScore: number;
  servingTeam: 'champions' | 'challengers';
  isGameComplete: boolean;
  winner?: MatchResult;
}

/**
 * Calculate score update when a team scores points
 * Handles serving rotation and game completion detection
 *
 * @param match - Current match state
 * @param team - Which team scored ('champions' or 'challengers')
 * @param addVal - Number of points to add (can be negative to subtract)
 * @returns ScoringUpdate with new scores, serving team, and completion status
 */
export function calculateScoreUpdate(
  match: Match,
  team: 'champions' | 'challengers',
  addVal: number,
): ScoringUpdate {
  // Determine if we were in deuce before this point
  const [lowest, highest] = [match.challengersScore, match.championsScore].sort();
  const wasDeuce = lowest >= (WINNING_SCORE - 1) && highest >= (WINNING_SCORE - 1);
  const maxPossibleScore = wasDeuce ? lowest + 2 : WINNING_SCORE;

  // Calculate new scores with clamping
  const newChampionsScore = clamp(
    team === 'champions' ? match.championsScore + addVal : match.championsScore,
    0,
    maxPossibleScore,
  );
  const newChallengersScore = clamp(
    team === 'challengers' ? match.challengersScore + addVal : match.challengersScore,
    0,
    maxPossibleScore,
  );

  // Calculate total scores including handicap
  const handicap = match.championWinStreak * 2;
  const championsTotal = newChampionsScore;
  const challengersTotal = newChallengersScore + handicap;

  // Determine serving team based on total points
  const totalPoints = newChampionsScore + newChallengersScore;
  let newServingTeam = match.servingTeam;

  // Check if we're in deuce (10:10 or more)
  const isDeuce = championsTotal >= (WINNING_SCORE - 1) && challengersTotal >= (WINNING_SCORE - 1);

  if (isDeuce) {
    // In deuce, serving changes every point
    newServingTeam = match.servingTeam === 'champions' ? 'challengers' : 'champions';
  } else {
    // Normal game: serving changes every 2 points
    const servingChange = Math.floor(totalPoints / 2);
    newServingTeam = servingChange % 2 === 0 ? 'champions' : 'challengers';
  }

  // Check for game completion (11 points with 2+ point lead)
  let isGameComplete = false;
  let winner: MatchResult | undefined;

  if (championsTotal >= WINNING_SCORE || challengersTotal >= WINNING_SCORE) {
    const diff = Math.abs(championsTotal - challengersTotal);
    if (diff >= 2) {
      isGameComplete = true;
      winner = championsTotal > challengersTotal ? 'champions' : 'challengers';
    }
  }

  return {
    championsScore: newChampionsScore,
    challengersScore: newChallengersScore,
    servingTeam: newServingTeam,
    isGameComplete,
    winner,
  };
}

/**
 * Calculate serving team based on current point totals
 * Used for display purposes
 *
 * @param totalPoints - Sum of both team scores (without handicap)
 * @param championsScore - Champions current score
 * @param challengersScore - Challengers current score
 * @param handicap - Current handicap for challengers
 * @returns Which team is serving
 */
export function calculateServingTeam(
  totalPoints: number,
  championsScore: number,
  challengersScore: number,
  handicap: number,
): 'champions' | 'challengers' {
  const championsTotal = championsScore;
  const challengersTotal = challengersScore + handicap;
  const isDeuce = championsTotal >= 10 && challengersTotal >= 10;

  if (isDeuce) {
    // In deuce, alternate every point
    return totalPoints % 2 === 0 ? 'champions' : 'challengers';
  }

  // Normal game: serving changes every 2 points
  const servingChange = Math.floor(totalPoints / 2);
  return servingChange % 2 === 0 ? 'champions' : 'challengers';
}
