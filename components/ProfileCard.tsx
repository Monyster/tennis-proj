'use client';

import Image from 'next/image';
import { useAuth } from '@/lib/useAuth';
import { useGlobalStats } from '@/lib/useGlobalStats';
import { calculateWinPercentage } from '@/lib/utils';
import Button from './button/button';
import Typography from './typography/typography';

/**
 * Profile Card component showing user info and basic stats
 */
export default function ProfileCard() {
  const { user } = useAuth();
  const { stats, loading } = useGlobalStats(user?.uid || null);

  if (!user) {
    return null;
  }

  const totalGames = (stats?.totalWins || 0) + (stats?.totalLosses || 0);
  const winRate = calculateWinPercentage(stats?.totalWins || 0, stats?.totalLosses || 0);

  return (
    <div className="bg-[#1e2939] rounded-lg p-6 space-y-4 border-2 border-[#75db70]/30 shadow-lg">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        {/* Photo */}
        <div className="relative">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.displayName || 'Profile'}
              width={64}
              height={64}
              className="rounded-full border-2 border-[#75db70]"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#75db70] flex items-center justify-center border-2 border-[#75db70]">
              <span className="text-2xl font-bold text-[#101827]">
                {(user.displayName || 'G')[0].toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Name & Stats */}
        <div className="flex-1">
          <Typography.H5 className="text-[#fef4e5] mb-1">
            {user.displayName || 'Гравець'}
          </Typography.H5>

          {loading ? (
            <Typography.BodySRegular className="text-[#9198a0]">
              Завантаження...
            </Typography.BodySRegular>
          ) : (
            <div className="flex gap-4 text-sm">
              <span className="text-[#9198a0]">
                <span className="text-[#75db70] font-semibold">{stats?.totalWins || 0}</span> П
              </span>
              <span className="text-[#9198a0]">
                <span className="text-error-500 font-semibold">{stats?.totalLosses || 0}</span> Пр
              </span>
              {totalGames > 0 && (
                <span className="text-[#9198a0]">
                  <span className="text-[#fef4e5] font-semibold">{winRate}%</span> WR
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Manage Button */}
      <Button
        href="/profile"
        variant="ghost"
        size="small"
        className="w-full border border-[#9198a0]/30 hover:border-[#75db70] hover:bg-[#75db70]/10 text-[#fef4e5]"
      >
        Керувати профілем →
      </Button>
    </div>
  );
}
