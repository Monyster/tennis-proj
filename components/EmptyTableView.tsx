"use client";

const Scoreboard = () => {
	return (
		<div className="mb-4 bg-gray-900 rounded-lg p-4 shadow-lg">
			<div className="flex items-center justify-between gap-4">
				{/* Champions Score */}
				<div className="flex-1 text-center">
					<div className="text-xs text-gray-400 mb-1 font-semibold">
						ЧЕМПІОНИ
					</div>
					<div className="text-5xl font-bold text-gray-600 tabular-nums">0</div>
				</div>

				{/* Separator */}
				<div className="text-3xl text-gray-500 font-thin">:</div>

				{/* Challengers Score */}
				<div className="flex-1 text-center">
					<div className="text-xs text-gray-400 mb-1 font-semibold">
						ПРЕТЕНДЕНТИ
					</div>
					<div className="text-5xl font-bold text-gray-600 tabular-nums">0</div>
				</div>
			</div>

			{/* Status message */}
			<div className="mt-3 text-center text-xs text-gray-500">
				Очікування на початок гри
			</div>
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
			<Scoreboard />

			<div className="h-1"></div>

			<TableView />

			<div className="h-19"></div>
		</div>
	);
}
