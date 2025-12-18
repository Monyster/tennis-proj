'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateRoom } from '@/components/CreateRoom';
import { JoinRoom } from '@/components/JoinRoom';
import { useRoom } from '@/lib/useRoom';
import AuthGuard from '@/components/AuthGuard';
import UserProfile from '@/components/UserProfile';

/**
 * Main landing page
 * Allows users to create a new room or join an existing one
 */
export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { createRoom, joinRoom } = useRoom(null);

  const handleCreateRoom = async (playerName?: string) => {
    setIsLoading(true);
    try {
      const code = await createRoom(playerName);
      router.push(`/room/${code}`);
    } catch (error) {
      console.error('Error creating room:', error);
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async (code: string, playerName?: string) => {
    setIsLoading(true);
    try {
      const success = await joinRoom(code, playerName);
      if (success) {
        router.push(`/room/${code}`);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error joining room:', error);
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* User Profile in top-right */}
          <div className="flex justify-end">
            <UserProfile />
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="text-6xl mb-4">🏓</div>
            <h1 className="text-4xl font-bold text-gray-900">Пінг-Понг</h1>
            <p className="text-xl text-gray-600">з Друзями</p>
          </div>

        {/* Create Room */}
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 text-center">
            Створити нову гру
          </h2>
          <CreateRoom
            onCreateRoom={handleCreateRoom}
            isLoading={isLoading}
          />
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent text-gray-500">або</span>
          </div>
        </div>

        {/* Join Room */}
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 text-center">
            Приєднатися до гри
          </h2>
          <JoinRoom
            onJoinRoom={handleJoinRoom}
            isLoading={isLoading}
          />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          Грайте в настільний теніс 2 на 2 з друзями
        </p>
        </div>
      </div>
    </AuthGuard>
  );
}
