'use client';

import { useState } from 'react';
import { Room } from '@/types';
import { Stats } from './Stats';
import UserProfile from './UserProfile';

interface DrawerProps {
  room: Room | null;
  onLeaveRoom?: () => void;
  onCopyRoomCode?: () => void;
}

/**
 * Side drawer navigation component
 * Provides access to stats, settings, and room info
 */
export function Drawer({ room, onLeaveRoom, onCopyRoomCode }: DrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const handleOpenStats = () => {
    setShowStats(true);
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
        aria-label="Меню"
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
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Меню</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
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

          {/* User profile section */}
          <div className="p-4 border-b border-gray-200">
            <UserProfile />
          </div>

          {/* Room info */}
          {room && (
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600 mb-1">Кімната</div>
              <div className="flex items-center justify-between">
                <div className="text-lg font-mono font-bold text-gray-900">
                  {room.code}
                </div>
                {onCopyRoomCode && (
                  <button
                    onClick={() => {
                      onCopyRoomCode();
                      setIsOpen(false);
                    }}
                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition"
                  >
                    Копіювати
                  </button>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Object.keys(room.players).length}{' '}
                {Object.keys(room.players).length === 1 ? 'гравець' : 'гравців'}
              </div>
            </div>
          )}

          {/* Menu items */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-2">
              {room && (
                <button
                  onClick={handleOpenStats}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <span className="font-medium">Статистика</span>
                </button>
              )}

              {onLeaveRoom && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onLeaveRoom();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition mt-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="font-medium">Вийти з кімнати</span>
                </button>
              )}
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 text-center text-xs text-gray-500">
            <div className="text-4xl mb-2">🎯</div>
            <div className="font-semibold text-gray-700">Handicap</div>
            <div>Настільний теніс з форою</div>
          </div>
        </div>
      </div>

      {/* Stats Modal */}
      {room && (
        <Stats
          players={room.players}
          isOpen={showStats}
          onClose={() => setShowStats(false)}
        />
      )}
    </>
  );
}
