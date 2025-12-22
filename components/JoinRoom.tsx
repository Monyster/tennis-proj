'use client';

import Button from '@/components/button/button';
import Typography from '@/components/typography/typography';

interface JoinRoomProps {
  code: string;
  error: string;
  isLoading: boolean;
  onCodeChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

/**
 * Component for joining an existing room
 */
export default function JoinRoom({
  code,
  error,
  isLoading,
  onCodeChange,
  onSubmit,
}: JoinRoomProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCodeChange(e.target.value.toUpperCase());
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <form onSubmit={onSubmit} className="w-full space-y-4">
        <Typography.H5 className="text-center">Приєднатися</Typography.H5>

        <div className="space-y-2">
          <Typography.Label htmlFor="roomCode">Код кімнати</Typography.Label>
          <input
            id="roomCode"
            type="text"
            value={code}
            onChange={handleInputChange}
            placeholder="PING-1234"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            disabled={isLoading}
            maxLength={9}
            autoCapitalize="characters"
          />
          {error && <small className="text-sm text-error-600">{error}</small>}
        </div>

        <Button
          variant="primary"
          size="big"
          className="w-full"
          type="submit"
          disabled={isLoading || !code.trim().startsWith('PING-')}
        >
          {isLoading ? 'Приєднання...' : 'Приєднатись'}
        </Button>
      </form>
    </div>
  );
}
