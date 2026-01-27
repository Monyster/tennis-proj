'use client';

import Button from '@/components/button/button';
import Typography from '@/components/typography/typography';

interface CreateRoomProps {
  onCreateRoom: () => void;
  isLoading: boolean;
}

/**
 * Component for creating a new room
 */
export default function CreateRoom({ onCreateRoom, isLoading }: CreateRoomProps) {
  return (
    <div className="bg-[#1e2939] rounded-lg shadow-lg p-6 space-y-4 border border-[#9198a0]/20">
      <Typography.H5 className="text-center text-[#fef4e5]">Створити</Typography.H5>

      <Button
        variant="primary"
        size="big"
        className="w-full"
        onClick={onCreateRoom}
        disabled={isLoading}
      >
        Створити нову кімнату
      </Button>
    </div>
  );
}
