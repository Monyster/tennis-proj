import { cn } from '@/lib/utils';

const bgColorClasses = {
  blue: ['bg-blue-500', 'hover:bg-blue-600'],
  orange: ['bg-orange-500', 'hover:bg-orange-600']
};

interface SpinButtonsProps {
  onIncrement: () => void;
  onDecrement: () => void;
  bgColor: keyof typeof bgColorClasses,
}


export default function SpinButtons({
  onIncrement,
  onDecrement,
  bgColor,
}: SpinButtonsProps) {
  const [bg, bgHover] = bgColorClasses[bgColor];
  const baseBtnClass = cn(
    `flex-1 flex items-center justify-center transition-colors text-white`,
    bg,
    bgHover,
  );

  return (
    <div className='flex flex-col w-8 h-15 shadow-sm'>
      <button
        type='button'
        onClick={onIncrement}
        className={`${baseBtnClass} rounded-t-lg border-b border-white  font-bold`}
        aria-label='Increment'
      >
        +
      </button>
      <button
        type='button'
        onClick={onDecrement}
        className={`${baseBtnClass} rounded-b-lg font-bold`}
        aria-label='Decrement'
      >
        -
      </button>
    </div>
  );
}