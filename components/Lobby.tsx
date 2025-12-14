'use client';

import { useState, useEffect } from 'react';
import { Room, MIN_PLAYERS } from '@/types';
import { PlayerCard } from './PlayerCard';
import { InviteModal } from './InviteModal';
import { findPlayerTeam, getPartnerId } from '@/lib/utils';

interface LobbyProps {
  room: Room;
  playerId: string;
  onStartGame: () => void;
  onSendInvite: (toPlayerId: string) => void;
  onAcceptInvite: (inviteId: string) => void;
  onDeclineInvite: (inviteId: string) => void;
  onCopyRoomCode: () => void;
}

/**
 * Lobby component - shows players, teams, and allows starting the game
 */
export function Lobby({
  room,
  playerId,
  onStartGame,
  onSendInvite,
  onAcceptInvite,
  onDeclineInvite,
  onCopyRoomCode,
}: LobbyProps) {
  const [showInviteModal, setShowInviteModal] = useState(false);

  const isHost = room.hostId === playerId;
  const playerCount = Object.keys(room.players).length;
  const canStart = playerCount >= MIN_PLAYERS;

  const myTeamId = findPlayerTeam(playerId, room.teams);
  const myTeam = myTeamId && room.teams ? room.teams[myTeamId] : null;
  const myPartnerId = myTeam ? getPartnerId(playerId, myTeam) : null;

  const pendingInvites = Object.entries(room.invites || {})
    .filter(([, invite]) => invite.toPlayerId === playerId)
    .map(([id, invite]) => ({ ...invite, id }));

  const players = Object.values(room.players);

  // Group players by team status
  const teams = Object.values(room.teams || {});
  const playersInTeams = new Set(
    teams.flatMap((t) => [t.player1Id, t.player2Id])
  );
  const benchPlayers = room.bench.map((id) => room.players[id]).filter(Boolean);
  const soloPlayers = players.filter(
    (p) => !playersInTeams.has(p.id) && !room.bench.includes(p.id)
  );

  // Auto-open modal when new invites arrive
  useEffect(() => {
    if (pendingInvites.length > 0 && !showInviteModal) {
      setShowInviteModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingInvites.length]); // Only trigger when invite count changes

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Кімната: {room.code}
          </h1>
          <div className="flex gap-2">
            {pendingInvites.length > 0 && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="relative px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Запрошення
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {pendingInvites.length}
                </span>
              </button>
            )}
            <button
              onClick={onCopyRoomCode}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
            >
              Копіювати код
            </button>
          </div>
        </div>
        <p className="text-gray-600">
          Гравців: {playerCount} {canStart ? '✓' : `(мін. ${MIN_PLAYERS})`}
        </p>
      </div>

      {/* Teams */}
      {teams.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Команди</h2>
          {teams.map((team) => {
            const player1 = room.players[team.player1Id];
            const player2 = room.players[team.player2Id];

            if (!player1 || !player2) return null;

            const isMyTeam = team.id === myTeamId;

            return (
              <div
                key={team.id}
                className={`p-4 rounded-lg border-2 ${
                  isMyTeam
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="font-medium text-gray-900">
                    {player1.name}
                  </span>
                  <span className="text-gray-400">──</span>
                  <span className="font-medium text-gray-900">
                    {player2.name}
                  </span>
                </div>
                {isMyTeam && (
                  <p className="text-center text-xs text-blue-600 mt-1">
                    Ваша команда
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Solo Players */}
      {soloPlayers.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Гравці без пари
          </h2>
          {soloPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              isCurrentPlayer={player.id === playerId}
              onInvite={
                player.id !== playerId && !myPartnerId
                  ? () => onSendInvite(player.id)
                  : undefined
              }
              showInviteButton={player.id !== playerId && !myPartnerId}
            />
          ))}
        </div>
      )}

      {/* Bench Players */}
      {benchPlayers.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">На лаві</h2>
          {benchPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              isCurrentPlayer={player.id === playerId}
            />
          ))}
        </div>
      )}

      {/* Start Game Button */}
      {isHost && (
        <div className="space-y-2">
          {!canStart && (
            <p className="text-center text-sm text-red-600">
              Потрібно мінімум {MIN_PLAYERS} гравців для початку
            </p>
          )}
          <button
            onClick={onStartGame}
            disabled={!canStart}
            className="w-full px-6 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            🎮 Почати гру
          </button>
        </div>
      )}

      {!isHost && (
        <p className="text-center text-sm text-gray-600">
          Очікування на хоста для початку гри...
        </p>
      )}

      {/* Invite Modal */}
      <InviteModal
        invites={pendingInvites}
        players={room.players}
        onAccept={onAcceptInvite}
        onDecline={onDeclineInvite}
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />
    </div>
  );
}
