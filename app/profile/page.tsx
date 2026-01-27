'use client';

import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import ProfileSettings from '@/components/ProfileSettings';
import Typography from '@/components/typography/typography';
import { useAuth } from '@/lib/useAuth';
import { useGlobalStats } from '@/lib/useGlobalStats';
import { calculateWinPercentage } from '@/lib/utils';

/**
 * Profile page showing detailed stats and settings
 */
export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { stats, loading } = useGlobalStats(user?.uid || null);

  if (!user) {
    return null; // AuthGuard will handle redirect
  }

  const totalGames = (stats?.totalWins || 0) + (stats?.totalLosses || 0);
  const winRate = calculateWinPercentage(stats?.totalWins || 0, stats?.totalLosses || 0);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#101827] p-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto pt-6 mb-8">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-[#9198a0] hover:text-[#75db70] transition-colors mb-6"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <title>Back arrow</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Назад на головну</span>
          </button>

          <div className="text-center mb-8">
            <span className="text-4xl mb-4 inline-block">👤</span>
            <Typography.H3 className="text-[#fef4e5]">Профіль</Typography.H3>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Header Card */}
          <div className="bg-[#1e2939] rounded-lg p-6 border border-[#9198a0]/20">
            <div className="flex items-center gap-4 mb-4">
              {/* Photo */}
              {user.photoURL ? (
                <div className="relative w-20 h-20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Profile'}
                    className="w-20 h-20 rounded-full border-2 border-[#75db70]"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#75db70] flex items-center justify-center border-2 border-[#75db70]">
                  <span className="text-3xl font-bold text-[#101827]">
                    {(user.displayName || 'G')[0].toUpperCase()}
                  </span>
                </div>
              )}

              {/* Name & Email */}
              <div className="flex-1">
                <Typography.H4 className="text-[#fef4e5] mb-1">
                  {user.displayName || 'Гравець'}
                </Typography.H4>
                {!user.isAnonymous && user.email && (
                  <Typography.BodySRegular className="text-[#9198a0]">
                    {user.email}
                  </Typography.BodySRegular>
                )}
                {user.isAnonymous && (
                  <Typography.BodySRegular className="text-[#9198a0]">
                    Гість
                  </Typography.BodySRegular>
                )}
              </div>
            </div>
          </div>

          {/* Statistics Card */}
          <div className="bg-[#1e2939] rounded-lg p-6 border border-[#9198a0]/20">
            <Typography.H5 className="text-[#fef4e5] mb-4">📊 Статистика</Typography.H5>

            {loading ? (
              <Typography.BodyMRegular className="text-[#9198a0]">
                Завантаження...
              </Typography.BodyMRegular>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#101827] rounded-lg p-4 border border-[#9198a0]/10">
                  <Typography.BodySRegular className="text-[#9198a0] mb-1">
                    Всього ігор
                  </Typography.BodySRegular>
                  <Typography.H4 className="text-[#fef4e5]">{totalGames}</Typography.H4>
                </div>

                <div className="bg-[#101827] rounded-lg p-4 border border-[#9198a0]/10">
                  <Typography.BodySRegular className="text-[#9198a0] mb-1">
                    Відсоток перемог
                  </Typography.BodySRegular>
                  <Typography.H4 className="text-[#75db70]">{winRate}%</Typography.H4>
                </div>

                <div className="bg-[#101827] rounded-lg p-4 border border-[#9198a0]/10">
                  <Typography.BodySRegular className="text-[#9198a0] mb-1">
                    Перемоги
                  </Typography.BodySRegular>
                  <Typography.H4 className="text-[#75db70]">{stats?.totalWins || 0}</Typography.H4>
                </div>

                <div className="bg-[#101827] rounded-lg p-4 border border-[#9198a0]/10">
                  <Typography.BodySRegular className="text-[#9198a0] mb-1">
                    Поразки
                  </Typography.BodySRegular>
                  <Typography.H4 className="text-error-500">
                    {stats?.totalLosses || 0}
                  </Typography.H4>
                </div>
              </div>
            )}
          </div>

          {/* Settings Card */}
          <ProfileSettings />
        </div>
      </div>
    </AuthGuard>
  );
}
