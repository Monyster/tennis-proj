"use client";

import { findPlayerTeam, getPartnerId } from "@/lib/utils";
import { MIN_PLAYERS, Room } from "@/types";
import { useEffect, useState } from "react";
import EmptyTableView from "./EmptyTableView";
import { InviteModal } from "./InviteModal";
import { PlayerCard } from "./PlayerCard";

interface LobbyProps {
	room: Room;
	playerId: string;
	onStartGame: () => void;
	onSendInvite: (toPlayerId: string) => void;
	onAcceptInvite: (inviteId: string) => void;
	onDeclineInvite: (inviteId: string) => void;
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
		teams.flatMap((t) => [t.player1Id, t.player2Id]),
	);
	const benchPlayers = room.bench.map((id) => room.players[id]).filter(Boolean);
	const soloPlayers = players.filter(
		(p) => !playersInTeams.has(p.id) && !room.bench.includes(p.id),
	);

	// Auto-open modal when new invites arrive
	useEffect(() => {
		if (pendingInvites.length > 0 && !showInviteModal) {
			setShowInviteModal(true);
		}
	}, [pendingInvites.length, showInviteModal]);

	return (
		<div className="max-w-2xl mx-auto p-6 space-y-6">
			<EmptyTableView />

			{/* Pending Invites Notification */}
			{pendingInvites.length > 0 && (
				<div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<svg
								className="w-5 h-5 text-blue-600"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
							</svg>
							<span className="font-medium text-blue-900">
								У вас {pendingInvites.length}{" "}
								{pendingInvites.length === 1 ? "запрошення" : "запрошень"}
							</span>
						</div>
						<button
							onClick={() => setShowInviteModal(true)}
							className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
						>
							Переглянути
						</button>
					</div>
				</div>
			)}

			{/* Player count info */}
			{!canStart && (
				<div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
					<p className="text-orange-800 font-medium">
						Потрібно мінімум {MIN_PLAYERS} гравців для початку гри
					</p>
					<p className="text-sm text-orange-600 mt-1">
						Зараз: {playerCount} {playerCount === 1 ? "гравець" : "гравців"}
					</p>
				</div>
			)}

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
										? "border-blue-500 bg-blue-50"
										: "border-gray-300 bg-white"
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
						<p className="text-center text-sm text-error-600">
							Потрібно мінімум {MIN_PLAYERS} гравців для початку
						</p>
					)}
					<button
						onClick={onStartGame}
						disabled={!canStart}
						className="w-full px-6 py-4 bg-success-600 text-white text-lg font-semibold rounded-lg hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-success-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						Почати гру
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
