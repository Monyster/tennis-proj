'use client';

import Typography from './typography/typography';

const Scoreboard = ({
  team1Name,
  team2Name,
  team1Score,
  team2Score,
  controllable = true,
  statusMessage,
  onTeam1Increment,
  onTeam1Decrement,
  onTeam2Increment,
  onTeam2Decrement,
}: {
  team1Name?: string;
  team2Name?: string;
  team1Score?: number;
  team2Score?: number;
  controllable?: boolean;
  statusMessage?: string;
  onTeam1Increment?: () => void;
  onTeam1Decrement?: () => void;
  onTeam2Increment?: () => void;
  onTeam2Decrement?: () => void;
}) => {
  return (
    <div className="mb-4 border-gray-200 border rounded-lg p-4 shadow-xs">
      <div className="flex items-center justify-between gap-4">
        {/* Champions Score */}
        <div className="flex-1 text-center">
          <Typography.H5 className="text-gray-600">{team1Name ?? 'Команда 1'}</Typography.H5>
          <Typography.H5 className="text-gray-600 text-5xl">{team1Score ?? '0'}</Typography.H5>

          {controllable && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                type="button"
                className="text-3xl border border-orange-400 text-white bg-orange-400 font-bold rounded-lg w-10 h-10 flex items-center justify-center"
                onClick={onTeam1Increment}
              >
                +
              </button>

              <button
                type="button"
                className="text-3xl border border-red-400 text-white bg-red-400 font-bold rounded-lg w-10 h-10 flex items-center justify-center"
                onClick={onTeam1Decrement}
              >
                -
              </button>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="text-3xl text-gray-500 font-thin">:</div>

        {/* Challengers Score */}
        <div className="flex-1 text-center">
          <Typography.H5 className="text-gray-600">{team2Name ?? 'Команда 2'}</Typography.H5>
          <Typography.H5 className="text-gray-600 text-5xl">{team2Score ?? '0'}</Typography.H5>

          {controllable && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                type="button"
                className="text-3xl border border-orange-400 text-white bg-orange-400 font-bold rounded-lg w-10 h-10 flex items-center justify-center"
                onClick={onTeam2Increment}
              >
                +
              </button>

              <button
                type="button"
                className="text-3xl border border-red-400 text-white bg-red-400 font-bold rounded-lg w-10 h-10 flex items-center justify-center"
                onClick={onTeam2Decrement}
              >
                -
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status message */}
      {statusMessage ? (
        <Typography.BodySMedium className="text-center text-gray-600 pt-4">
          {statusMessage}
        </Typography.BodySMedium>
      ) : null}
    </div>
  );
};

const TableView = () => {
  return (
    <div className="relative bg-green-700 rounded-2xl p-6 shadow-2xl mt-20">
      {/* Table surface */}
      <div className="relative bg-green-600 rounded-xl p-4 border-4 border-white">
        {/* Net */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-white"></div>
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
          <div className="flex justify-center">
            <div className="h-8 w-1 bg-white"></div>
          </div>
        </div>

        {/* Table markings */}
        <div className="h-48 flex items-center justify-center text-white/20 text-xs">
          <div className="absolute inset-4 border-2 border-white/20 rounded-lg"></div>
        </div>
      </div>

      {/* Empty player positions with icons */}
      {/* Champions - Top side */}
      <div className="absolute -top-20 left-1/4 -translate-x-1/2">
        <div className="bg-gray-100 px-3 py-2 rounded-lg shadow-md border-2 border-dashed border-gray-300">
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-400">Вільно</span>
          </div>
        </div>
      </div>
      <div className="absolute -top-20 right-1/4 translate-x-1/2">
        <div className="bg-gray-100 px-3 py-2 rounded-lg shadow-md border-2 border-dashed border-gray-300">
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-400">Вільно</span>
          </div>
        </div>
      </div>

      {/* Challengers - Bottom side */}
      <div className="absolute -bottom-20 left-1/4 -translate-x-1/2">
        <div className="bg-gray-100 px-3 py-2 rounded-lg shadow-md border-2 border-dashed border-gray-300">
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-400">Вільно</span>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-20 right-1/4 translate-x-1/2">
        <div className="bg-gray-100 px-3 py-2 rounded-lg shadow-md border-2 border-dashed border-gray-300">
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-400">Вільно</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function EmptyTableView() {
  return (
    <div className="w-full max-w-md mx-auto p-1">
      <Scoreboard statusMessage="Очікуємо гравців" />

      <div className="h-1"></div>

      <TableView />

      <div className="h-19"></div>
    </div>
  );
}
