'use client';

import AuthGuard from '@/components/AuthGuard';
import CreateRoom from '@/components/CreateRoom';
import JoinRoom from '@/components/JoinRoom';
import ProfileCard from '@/components/ProfileCard';
import Typography from '@/components/typography/typography';
import { useHomeLogic } from '@/hooks/useHomeLogic';

export default function Home() {
  const { code, error, isLoading, handleCreateRoom, handleJoinRoomSubmit, handleCodeChange } =
    useHomeLogic();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#101827] p-4">
        {/* Logo - top left */}
        <div className="absolute top-6 left-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🏓</span>
            <Typography.H5 className="text-[#75db70] font-bold">Handicap</Typography.H5>
          </div>
        </div>

        {/* Main Content - Center */}
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md space-y-6">
            {/* Profile Card */}
            <ProfileCard />

            {/* Create Room Section */}
            <CreateRoom onCreateRoom={handleCreateRoom} isLoading={isLoading} />

            {/* Divider */}
            <div className="flex items-center gap-2 justify-between">
              <div className="w-2/5 border-t border-[#9198a0]/30" />
              <Typography.BodyMRegular className="text-[#9198a0]">або</Typography.BodyMRegular>
              <div className="w-2/5 border-t border-[#9198a0]/30" />
            </div>

            {/* Join Room Section */}
            <JoinRoom
              code={code}
              error={error}
              isLoading={isLoading}
              onCodeChange={handleCodeChange}
              onSubmit={handleJoinRoomSubmit}
            />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
