'use client';

import { useState, useEffect, useCallback } from 'react';
import { ref, onValue, set, update, get } from 'firebase/database';
import { db } from './firebase';
import {
  Room,
  Player,
  Team,
  Match,
  Invite,
  UseRoomResult,
  MatchResult,
  MIN_PLAYERS,
  VOTE_THRESHOLD,
  getServingTeam,
} from '@/types';
import {
  generateRoomCode,
  generateTeamId,
  generateInviteId,
  normalizeRoomCode,
  createRandomTeams,
  whoStays,
  findPlayerTeam,
  createPlayerFromAuth,
} from './utils';
import { useAuth } from './useAuth';

/**
 * Custom hook for managing room state and operations
 * Implements Repository pattern for data access and Command pattern for actions
 */
export function useRoom(roomCode: string | null): UseRoomResult {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const playerId = user?.uid || '';

  // Derived state
  const currentPlayer = room?.players?.[playerId] ?? null;
  const pendingInvites = room
    ? Object.entries(room.invites || {})
        .filter(([, invite]) => invite.toPlayerId === playerId)
        .map(([id, invite]) => ({ ...invite, id }))
    : [];

  // Firebase realtime subscription
  useEffect(() => {
    if (!roomCode) {
      setLoading(false);
      return;
    }

    const normalized = normalizeRoomCode(roomCode);
    const roomRef = ref(db, `rooms/${normalized}`);

    setLoading(true);
    setError(null);

    const unsubscribe = onValue(
      roomRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Normalize data to ensure all fields are initialized
          const normalizedRoom: Room = {
            ...data,
            teams: data.teams || {},
            invites: data.invites || {},
            queue: data.queue || [],
            bench: data.bench || [],
            votes: data.votes || {
              pendingResult: null,
              voters: {},
              startedAt: null,
            },
          };
          setRoom(normalizedRoom);
        } else {
          setRoom(null);
          setError('Кімнату не знайдено');
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [roomCode]);

  /**
   * Create a new room
   * Returns the room code
   * Requires user to be authenticated
   */
  const createRoom = useCallback(async (): Promise<string> => {
    if (!user) {
      throw new Error('Потрібна авторизація для створення кімнати');
    }

    const code = generateRoomCode();
    const normalized = normalizeRoomCode(code);
    const now = Date.now();

    const playerData = createPlayerFromAuth(
      user.uid,
      user.displayName,
      user.photoURL,
      user.isAnonymous
    );

    const newPlayer: Player = {
      ...playerData,
      joinedAt: now,
      gamesPlayed: 0,
      satOutLast: 0,
      wins: 0,
      losses: 0,
    };

    const newRoom: Room = {
      code: normalized,
      status: 'lobby',
      createdAt: now,
      hostId: user.uid,
      players: { [user.uid]: newPlayer },
      teams: {},
      match: null,
      queue: [],
      bench: [],
      votes: {
        pendingResult: null,
        voters: {},
        startedAt: null,
      },
      invites: {},
    };

    const roomRef = ref(db, `rooms/${normalized}`);
    await set(roomRef, newRoom);

    return code;
  }, [user]);

  /**
   * Join an existing room
   * Returns true if successful
   * Requires user to be authenticated
   */
  const joinRoom = useCallback(
    async (code: string): Promise<boolean> => {
      if (!user) {
        throw new Error('Потрібна авторизація для приєднання до кімнати');
      }

      const normalized = normalizeRoomCode(code);
      const roomRef = ref(db, `rooms/${normalized}`);
      const snapshot = await get(roomRef);

      if (!snapshot.exists()) {
        setError('Кімнату не знайдено');
        return false;
      }

      const roomData = snapshot.val() as Room;

      // Check if player already in room
      if (roomData.players[user.uid]) {
        return true;
      }

      const now = Date.now();
      const playerData = createPlayerFromAuth(
        user.uid,
        user.displayName,
        user.photoURL,
        user.isAnonymous
      );

      const newPlayer: Player = {
        ...playerData,
        joinedAt: now,
        gamesPlayed: 0,
        satOutLast: 0,
        wins: 0,
        losses: 0,
      };

      const updates: Record<string, unknown> = {
        [`players/${user.uid}`]: newPlayer,
      };

      // If lobby, add to beginning of queue or bench if odd number
      if (roomData.status === 'lobby') {
        const playerCount = Object.keys(roomData.players).length + 1;
        if (playerCount % 2 === 1) {
          // Odd number: goes to bench
          updates['bench'] = [...(roomData.bench || []), user.uid];
        }
      } else {
        // Game in progress: add to queue start or bench if odd
        const playerCount = Object.keys(roomData.players).length + 1;
        if (playerCount % 2 === 1) {
          updates['bench'] = [...(roomData.bench || []), user.uid];
        } else {
          updates['queue'] = [user.uid, ...(roomData.queue || [])];
        }
      }

      await update(roomRef, updates);
      return true;
    },
    [user]
  );

  /**
   * Leave the room
   */
  const leaveRoom = useCallback(async (): Promise<void> => {
    if (!room || !user) return;

    const roomRef = ref(db, `rooms/${room.code}`);
    const updates: Record<string, unknown> = {};

    // Remove player
    updates[`players/${user.uid}`] = null;

    // Remove from bench if present
    if (room.bench.includes(user.uid)) {
      updates['bench'] = room.bench.filter((id) => id !== user.uid);
    }

    // Remove from queue if present
    if (room.queue.includes(user.uid)) {
      updates['queue'] = room.queue.filter((id) => id !== user.uid);
    }

    // Remove team if player is in one
    const playerTeamId = findPlayerTeam(user.uid, room.teams);
    if (playerTeamId) {
      updates[`teams/${playerTeamId}`] = null;
      updates['queue'] = room.queue.filter((id) => id !== playerTeamId);
    }

    // Remove any invites involving this player
    Object.entries(room.invites || {}).forEach(([inviteId, invite]) => {
      if (invite.fromPlayerId === user.uid || invite.toPlayerId === user.uid) {
        updates[`invites/${inviteId}`] = null;
      }
    });

    await update(roomRef, updates);
  }, [room, user]);

  /**
   * Send invite to another player to form a team
   */
  const sendInvite = useCallback(
    async (toPlayerId: string): Promise<void> => {
      if (!room || !user) return;

      // Check if invite already exists between these players
      const existingInvite = Object.values(room.invites || {}).find(
        (invite) =>
          (invite.fromPlayerId === user.uid && invite.toPlayerId === toPlayerId) ||
          (invite.fromPlayerId === toPlayerId && invite.toPlayerId === user.uid)
      );

      if (existingInvite) {
        // Invite already exists, don't create duplicate
        return;
      }

      const inviteId = generateInviteId();

      const newInvite: Invite = {
        fromPlayerId: user.uid,
        toPlayerId,
        createdAt: Date.now(),
      };

      const roomRef = ref(db, `rooms/${room.code}`);
      await update(roomRef, {
        [`invites/${inviteId}`]: newInvite,
      });
    },
    [room, user]
  );

  /**
   * Accept invite and form a team
   */
  const acceptInvite = useCallback(
    async (inviteId: string): Promise<void> => {
      if (!room || !user) return;

      const invite = room.invites[inviteId];
      if (!invite) return;

      const teamId = generateTeamId();

      const newTeam: Team = {
        id: teamId,
        player1Id: invite.fromPlayerId,
        player2Id: user.uid,
      };

      const roomRef = ref(db, `rooms/${room.code}`);
      const updates: Record<string, unknown> = {
        [`teams/${teamId}`]: newTeam,
        [`invites/${inviteId}`]: null,
      };

      // Remove both players from bench
      if (room.bench.includes(user.uid) || room.bench.includes(invite.fromPlayerId)) {
        updates['bench'] = room.bench.filter(
          (id) => id !== user.uid && id !== invite.fromPlayerId
        );
      }

      await update(roomRef, updates);
    },
    [room, user]
  );

  /**
   * Decline invite
   */
  const declineInvite = useCallback(
    async (inviteId: string): Promise<void> => {
      if (!room) return;

      const roomRef = ref(db, `rooms/${room.code}`);
      await update(roomRef, {
        [`invites/${inviteId}`]: null,
      });
    },
    [room]
  );

  /**
   * Start the game (host only)
   * Creates initial match with random teams
   */
  const startGame = useCallback(async (): Promise<void> => {
    if (!room || room.hostId !== playerId) {
      setError('Тільки хост може почати гру');
      return;
    }

    const playerIds = Object.keys(room.players);
    if (playerIds.length < MIN_PLAYERS) {
      setError(`Потрібно мінімум ${MIN_PLAYERS} гравців`);
      return;
    }

    const roomRef = ref(db, `rooms/${room.code}`);
    const updates: Record<string, unknown> = {};

    // Create teams from existing teams or random
    let teams = Object.values(room.teams);
    let benchPlayers: string[] = [...room.bench];

    // Find players without teams
    const playersInTeams = new Set(
      teams.flatMap((t) => [t.player1Id, t.player2Id])
    );
    const playersWithoutTeams = playerIds.filter(
      (id) => !playersInTeams.has(id) && !benchPlayers.includes(id)
    );

    // Create teams for players without teams
    if (playersWithoutTeams.length > 0) {
      const { teams: newTeams, bench: newBench } = createRandomTeams([
        ...playersWithoutTeams,
        ...benchPlayers,
      ]);
      teams = [...teams, ...newTeams];
      benchPlayers = newBench;
    }

    // Save all teams
    const teamsRecord: Record<string, Team> = {};
    teams.forEach((team) => {
      teamsRecord[team.id] = team;
      updates[`teams/${team.id}`] = team;
    });

    // Set up match: first two teams play, rest in queue
    const [championsTeam, challengersTeam, ...queueTeams] = teams;

    const match: Match = {
      championsTeamId: championsTeam.id,
      challengersTeamId: challengersTeam.id,
      championWinStreak: 0,
      servingTeam: 'champions',
      championsScore: 0,
      challengersScore: 0,
    };

    updates['match'] = match;
    updates['status'] = 'playing';
    updates['queue'] = queueTeams.map((t) => t.id);
    updates['bench'] = benchPlayers;

    await update(roomRef, updates);
  }, [room, playerId]);

  /**
   * Process match result and perform rotation
   * Implements complex rotation logic with odd/even player counts
   */
  const processMatchResult = useCallback(async (
    currentRoom: Room,
    winner: MatchResult
  ) => {
    if (!currentRoom.match) return;

    const roomRef = ref(db, `rooms/${currentRoom.code}`);
    const updates: Record<string, unknown> = {};

    const championsTeam = currentRoom.teams[currentRoom.match.championsTeamId];
    const challengersTeam = currentRoom.teams[currentRoom.match.challengersTeamId];

    if (!championsTeam || !challengersTeam) {
      setError('Команди не знайдено');
      return;
    }

    const playerCount = Object.keys(currentRoom.players).length;
    const isOdd = playerCount % 2 === 1;

    // Update player stats
    const winningTeam = winner === 'champions' ? championsTeam : challengersTeam;
    const losingTeam = winner === 'champions' ? challengersTeam : championsTeam;

    [winningTeam.player1Id, winningTeam.player2Id].forEach((playerId) => {
      updates[`players/${playerId}/wins`] = (currentRoom.players[playerId].wins || 0) + 1;
      updates[`players/${playerId}/gamesPlayed`] =
        (currentRoom.players[playerId].gamesPlayed || 0) + 1;
    });

    [losingTeam.player1Id, losingTeam.player2Id].forEach((playerId) => {
      updates[`players/${playerId}/losses`] = (currentRoom.players[playerId].losses || 0) + 1;
      updates[`players/${playerId}/gamesPlayed`] =
        (currentRoom.players[playerId].gamesPlayed || 0) + 1;
    });

    let newChampionsTeamId: string;
    let newChallengersTeamId: string;
    let newWinStreak: number;
    let newQueue = [...currentRoom.queue];
    let newBench = [...currentRoom.bench];

    if (winner === 'champions') {
      // Champions win: they stay, increase win streak
      newChampionsTeamId = championsTeam.id;
      newWinStreak = currentRoom.match.championWinStreak + 1;

      if (isOdd && newBench.length > 0) {
        // Odd count: one challenger stays, one goes to bench
        const decision = whoStays(challengersTeam, currentRoom.players);
        const playerFromBench = newBench[0];

        // Player who leaves goes to bench
        updates[`players/${decision.leaves}/satOutLast`] = Date.now();
        newBench = [decision.leaves];

        // Create new team: player who stays + player from bench
        const newTeamId = generateTeamId();
        const newTeam: Team = {
          id: newTeamId,
          player1Id: decision.stays,
          player2Id: playerFromBench,
        };
        updates[`teams/${newTeamId}`] = newTeam;
        newChallengersTeamId = newTeamId;
      } else {
        // Even count: losers go to queue end, new challengers from queue
        newQueue = [...newQueue, challengersTeam.id];
        const nextTeamId = newQueue.shift();
        if (!nextTeamId) {
          setError('Немає команд у черзі');
          return;
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
        updates[`players/${decision.leaves}/satOutLast`] = Date.now();
        newBench = [decision.leaves];

        // Create new team: player who stays + player from bench
        const newTeamId = generateTeamId();
        const newTeam: Team = {
          id: newTeamId,
          player1Id: decision.stays,
          player2Id: playerFromBench,
        };
        updates[`teams/${newTeamId}`] = newTeam;
        newChallengersTeamId = newTeamId;
      } else {
        // Even count: ex-champions go to queue end
        newQueue = [...newQueue, championsTeam.id];
        const nextTeamId = newQueue.shift();
        if (!nextTeamId) {
          setError('Немає команд у черзі');
          return;
        }
        newChallengersTeamId = nextTeamId;
      }
    }

    // Update match
    const newServingTeam = getServingTeam(newWinStreak);
    const newMatch: Match = {
      championsTeamId: newChampionsTeamId,
      challengersTeamId: newChallengersTeamId,
      championWinStreak: newWinStreak,
      servingTeam: newServingTeam,
      championsScore: 0,
      challengersScore: 0,
    };

    updates['match'] = newMatch;
    updates['queue'] = newQueue;
    updates['bench'] = newBench;

    // Reset votes
    updates['votes'] = {
      pendingResult: null,
      voters: {},
      startedAt: null,
    };

    await update(roomRef, updates);
  }, []);

  /**
   * Vote for match result
   * Processes rotation when threshold is reached
   */
  const voteResult = useCallback(
    async (result: MatchResult): Promise<void> => {
      if (!room || !room.match || !user) return;

      const roomRef = ref(db, `rooms/${room.code}`);
      const requiredVotes = Math.ceil(Object.keys(room.players).length * VOTE_THRESHOLD);

      // Start new voting or continue existing
      let voters = { ...room.votes.voters };

      if (room.votes.pendingResult !== result) {
        // New vote started
        voters = { [user.uid]: true };
      } else {
        // Add vote to existing
        voters[user.uid] = true;
      }

      const voteCount = Object.keys(voters).length;

      if (voteCount >= requiredVotes) {
        // Process match result
        await processMatchResult(room, result);
      } else {
        // Update votes
        await update(roomRef, {
          'votes/pendingResult': result,
          'votes/voters': voters,
          'votes/startedAt': room.votes.startedAt || Date.now(),
        });
      }
    },
    [room, user, processMatchResult]
  );

  /**
   * Increment score for a team
   * Handles serving team changes and automatic game completion
   */
  const incrementScore = useCallback(
    async (team: 'champions' | 'challengers'): Promise<void> => {
      if (!room || !room.match) return;

      const roomRef = ref(db, `rooms/${room.code}`);
      const match = room.match;

      const newChampionsScore =
        team === 'champions' ? match.championsScore + 1 : match.championsScore;
      const newChallengersScore =
        team === 'challengers' ? match.challengersScore + 1 : match.challengersScore;

      // Calculate total scores including handicap
      const handicap = match.championWinStreak * 2;
      const championsTotal = newChampionsScore;
      const challengersTotal = newChallengersScore + handicap;

      // Determine serving team based on total points
      const totalPoints = newChampionsScore + newChallengersScore;
      let newServingTeam = match.servingTeam;

      // Check if we're in deuce (10:10 or more)
      const isDeuce = championsTotal >= 10 && challengersTotal >= 10;

      if (isDeuce) {
        // In deuce, serving changes every point
        newServingTeam = match.servingTeam === 'champions' ? 'challengers' : 'champions';
      } else {
        // Normal game: serving changes every 2 points
        const servingChange = Math.floor(totalPoints / 2);
        newServingTeam = servingChange % 2 === 0 ? 'champions' : 'challengers';
      }

      const updates: Record<string, unknown> = {
        'match/championsScore': newChampionsScore,
        'match/challengersScore': newChallengersScore,
        'match/servingTeam': newServingTeam,
      };

      await update(roomRef, updates);

      // Check for game completion (11 points with 2+ point lead)
      if (championsTotal >= 11 || challengersTotal >= 11) {
        const diff = Math.abs(championsTotal - challengersTotal);
        if (diff >= 2) {
          // Game completed - trigger voting automatically
          const winner = championsTotal > challengersTotal ? 'champions' : 'challengers';
          // Auto-process result without voting for score-based completion
          await processMatchResult(room, winner);
        }
      }
    },
    [room, processMatchResult]
  );

  return {
    room,
    loading,
    error,
    playerId,
    currentPlayer,
    pendingInvites,
    createRoom,
    joinRoom,
    leaveRoom,
    sendInvite,
    acceptInvite,
    declineInvite,
    startGame,
    voteResult,
    incrementScore,
  };
}
