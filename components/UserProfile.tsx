'use client';

import { useAuth } from '@/lib/useAuth';
import { useState } from 'react';

export default function UserProfile() {
  const { user, isAnonymous, upgradeAnonymousToGoogle, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  if (!user) return null;

  const handleUpgrade = async () => {
    try {
      setUpgrading(true);
      await upgradeAnonymousToGoogle();
      setShowMenu(false);
    } catch (err) {
      console.error('Upgrade failed:', err);
    } finally {
      setUpgrading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowMenu(false);
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 transition hover:bg-gray-50"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className="h-6 w-6 rounded-full"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-xs font-medium text-gray-700">
            {isAnonymous ? '?' : user.displayName?.[0] || 'U'}
          </div>
        )}
        <span className="text-sm font-medium text-gray-700">
          {isAnonymous ? 'Гість' : user.displayName || 'Гравець'}
        </span>
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
            <div className="border-b border-gray-200 px-3 py-2">
              <p className="text-sm font-medium text-gray-900">
                {isAnonymous ? 'Гість' : user.displayName || 'Гравець'}
              </p>
              {user.email && <p className="text-xs text-gray-500">{user.email}</p>}
              {isAnonymous && <p className="mt-1 text-xs text-amber-600">Анонімний акаунт</p>}
            </div>

            <div className="mt-2 space-y-1">
              {isAnonymous && (
                <button
                  onClick={handleUpgrade}
                  disabled={upgrading}
                  className="w-full rounded-md px-3 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                >
                  {upgrading ? "Прив'язування..." : "Прив'язати Google акаунт"}
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Вийти
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
