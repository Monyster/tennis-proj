'use client';

import { InviteWithId, Player } from '@/types';

interface InviteModalProps {
  invites: InviteWithId[];
  players: Record<string, Player>;
  onAccept: (inviteId: string) => void;
  onDecline: (inviteId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal for displaying and managing team invites
 */
export function InviteModal({
  invites,
  players,
  onAccept,
  onDecline,
  isOpen,
  onClose,
}: InviteModalProps) {
  if (!isOpen || invites.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Запрошення до команди
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          {invites.map((invite) => {
            const fromPlayer = players[invite.fromPlayerId];
            if (!fromPlayer) return null;

            return (
              <div
                key={invite.id}
                className="p-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <p className="text-sm text-gray-900 mb-3">
                  <span className="font-medium">{fromPlayer.name}</span>{' '}
                  запрошує вас до команди
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onAccept(invite.id);
                      if (invites.length === 1) onClose();
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                  >
                    Прийняти
                  </button>
                  <button
                    onClick={() => {
                      onDecline(invite.id);
                      if (invites.length === 1) onClose();
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
                  >
                    Відхилити
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
