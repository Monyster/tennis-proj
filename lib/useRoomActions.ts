'use client';

import type {
    Invite,
    Match,
    MatchResult,
    Player,
    Room,
    Team,
} from '@/types';
import { MIN_PLAYERS } from '@/types';
import type { User } from 'firebase/auth';
import { get, ref, set, update } from 'firebase/database';
import { useCallback } from 'react';
import { db } from './firebase';
import { calculateMatchRotation } from './services/matchRotation.service';
import { calculateScoreUpdate } from './services/scoring.service';
import { processVote as processVoteService } from './services/voting.service';
import {
    createPlayerFromAuth,
    createRandomTeams,
    findPlayerTeam,
    generateInviteId,
    generateRoomCode,
    generateTeamId,
    normalizeRoomCode,
} from './utils';

interface UseRoomActionsProps {
  room: Room | null;
  user: User | null;
  setError: (error: string | null) => void;
}

export function useRoomActions({ room, user, setError }: UseRoomActionsProps) {
  
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

      if (roomData.status === 'lobby') {
        const playerCount = Object.keys(roomData.players).length + 1;
        if (playerCount % 2 === 1) {
          updates['bench'] = [...(roomData.bench || []), user.uid];
        }
      } else {
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
    [user, setError]
  );

  const leaveRoom = useCallback(async (): Promise<void> => {
    if (!room || !user) return;

    const roomRef = ref(db, `rooms/${room.code}`);
    const updates: Record<string, unknown> = {};

    updates[`players/${user.uid}`] = null;

    if (room.bench.includes(user.uid)) {
      updates['bench'] = room.bench.filter((id) => id !== user.uid);
    }

    if (room.queue.includes(user.uid)) {
      updates['queue'] = room.queue.filter((id) => id !== user.uid);
    }

    const playerTeamId = findPlayerTeam(user.uid, room.teams);
    if (playerTeamId) {
      updates[`teams/${playerTeamId}`] = null;
      updates['queue'] = room.queue.filter((id) => id !== playerTeamId);
    }

    Object.entries(room.invites || {}).forEach(([inviteId, invite]) => {
      if (invite.fromPlayerId === user.uid || invite.toPlayerId === user.uid) {
        updates[`invites/${inviteId}`] = null;
      }
    });

    await update(roomRef, updates);
  }, [room, user]);

  const sendInvite = useCallback(
    async (toPlayerId: string): Promise<void> => {
      if (!room || !user) return;

      const existingInvite = Object.values(room.invites || {}).find(
        (invite) =>
          (invite.fromPlayerId === user.uid && invite.toPlayerId === toPlayerId) ||
          (invite.fromPlayerId === toPlayerId && invite.toPlayerId === user.uid)
      );

      if (existingInvite) {
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

      if (room.bench.includes(user.uid) || room.bench.includes(invite.fromPlayerId)) {
        updates['bench'] = room.bench.filter(
          (id) => id !== user.uid && id !== invite.fromPlayerId
        );
      }

      await update(roomRef, updates);
    },
    [room, user]
  );

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

  const startGame = useCallback(async (): Promise<void> => {
    if (!room || !user || room.hostId !== user.uid) {
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

    let teams = Object.values(room.teams);
    let benchPlayers: string[] = [...room.bench];

    const playersInTeams = new Set(
      teams.flatMap((t) => [t.player1Id, t.player2Id])
    );
    const playersWithoutTeams = playerIds.filter(
      (id) => !playersInTeams.has(id) && !benchPlayers.includes(id)
    );

    if (playersWithoutTeams.length > 0) {
      const { teams: newTeams, bench: newBench } = createRandomTeams([
        ...playersWithoutTeams,
        ...benchPlayers,
      ]);
      teams = [...teams, ...newTeams];
      benchPlayers = newBench;
    }

    teams.forEach((team) => {
      updates[`teams/${team.id}`] = team;
    });

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
  }, [room, user, setError]);

  const processMatchResult = useCallback(async (
    currentRoom: Room,
    winner: MatchResult
  ) => {
    if (!currentRoom.match) return;

    const roomRef = ref(db, `rooms/${currentRoom.code}`);
    const updates: Record<string, unknown> = {};

    try {
      const rotationResult = calculateMatchRotation(
        currentRoom,
        winner,
        generateTeamId
      );

      Object.entries(rotationResult.playerUpdates).forEach(([playerId, playerUpdate]) => {
        Object.entries(playerUpdate).forEach(([key, value]) => {
          updates[`players/${playerId}/${key}`] = value;
        });
      });

      Object.entries(rotationResult.teamUpdates).forEach(([teamId, team]) => {
        updates[`teams/${teamId}`] = team;
      });

      updates.match = rotationResult.newMatch;
      updates.queue = rotationResult.newQueue;
      updates.bench = rotationResult.newBench;

      updates.votes = {
        pendingResult: null,
        voters: {},
        startedAt: null,
      };

      await update(roomRef, updates);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Помилка ротації');
    }
  }, [setError]);

  const voteResult = useCallback(
    async (result: MatchResult): Promise<void> => {
      if (!room || !room.match || !user) return;

      const roomRef = ref(db, `rooms/${room.code}`);
      const totalPlayers = Object.keys(room.players).length;

      const votingUpdate = processVoteService(
        room.votes,
        result,
        user.uid,
        totalPlayers
      );

      if (votingUpdate.shouldProcess) {
        await processMatchResult(room, result);
      } else {
        await update(roomRef, {
          'votes/pendingResult': votingUpdate.pendingResult,
          'votes/voters': votingUpdate.newVoters,
          'votes/startedAt': room.votes.startedAt || Date.now(),
        });
      }
    },
    [room, user, processMatchResult]
  );

  const updateScore = useCallback(
    async (team: 'champions' | 'challengers', addVal: number): Promise<void> => {
      if (!room || !room.match) return;

      const roomRef = ref(db, `rooms/${room.code}`);
      const match = room.match;

      const scoringUpdate = calculateScoreUpdate(match, team, addVal);

      const updates: Record<string, unknown> = {
        'match/championsScore': scoringUpdate.championsScore,
        'match/challengersScore': scoringUpdate.challengersScore,
        'match/servingTeam': scoringUpdate.servingTeam,
      };

      await update(roomRef, updates);

      if (scoringUpdate.isGameComplete && scoringUpdate.winner) {
        await processMatchResult(room, scoringUpdate.winner);
      }
    },
    [room, processMatchResult]
  );

  return {
    createRoom,
    joinRoom,
    leaveRoom,
    sendInvite,
    acceptInvite,
    declineInvite,
    startGame,
    voteResult,
    updateScore,
  };
}
