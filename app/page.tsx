'use client';

import AuthGuard from '@/components/AuthGuard';
import CreateRoom from '@/components/CreateRoom';
import JoinRoom from '@/components/JoinRoom';
import Typography from '@/components/typography/typography';
import UserProfile from '@/components/UserProfile';
import { useHomeLogic } from '@/hooks/useHomeLogic';

export default function Home() {
  const { code, error, isLoading, handleCreateRoom, handleJoinRoomSubmit, handleCodeChange } =
    useHomeLogic();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-linear-to-br from-blue-100 to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* User Profile in top-right */}
          <div className="flex justify-end">
            <UserProfile />
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="text-6xl mb-4">🎯</div>
            <Typography.H1>Handicap</Typography.H1>
            <Typography.BodyL>Настільний теніс з форою</Typography.BodyL>
          </div>

          {/* Create Room Section */}
          <CreateRoom onCreateRoom={handleCreateRoom} isLoading={isLoading} />

          {/* Divider */}
          <div className="flex items-center gap-2 justify-between">
            <div className="w-2/5 border-t border-gray-300" />
            <Typography.BodyMRegular className="text-gray-500">або</Typography.BodyMRegular>
            <div className="w-2/5 border-t border-gray-300" />
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
    </AuthGuard>
  );
}
