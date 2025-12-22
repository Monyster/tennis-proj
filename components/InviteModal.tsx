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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-75">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🤝</div>
          <h2 className="text-2xl font-bold text-gray-900">
            Запрошення до команди
          </h2>
        </div>

        <div className="space-y-4">
          {invites.map((invite, index) => {
            const fromPlayer = players[invite.fromPlayerId];
            if (!fromPlayer) return null;

            return (
              <div
                key={invite.id}
                className="p-5 bg-blue-50 rounded-xl border-2 border-blue-200 shadow-sm"
              >
                <p className="text-base text-gray-900 mb-4 text-center">
                  <span className="font-bold text-blue-700">{fromPlayer.name}</span>{' '}
                  запрошує вас до команди
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      onAccept(invite.id);
                    }}
                    className="flex-1 px-5 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
                  >
                    Прийняти
                  </button>
                  <button
                    onClick={() => {
                      onDecline(invite.id);
                    }}
                    className="flex-1 px-5 py-3 bg-gray-300 text-gray-800 font-semibold rounded-xl hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all shadow-sm"
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
