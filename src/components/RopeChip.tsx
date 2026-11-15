import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface RopeChipProps {
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
  size?: 'sm' | 'md';
}

/** Toggle chip: a dashed rope outline when off, a navy tag with a brass rim when on. */
export const RopeChip = ({ pressed, onClick, children, size = 'md' }: RopeChipProps) => (
  <button
    type="button"
    aria-pressed={pressed}
    onClick={onClick}
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full border transition-[color,background-color,transform] duration-150 active:scale-95',
      size === 'md' ? 'h-8 px-3.5 text-sm' : 'h-7 px-3 text-xs',
      pressed
        ? 'border-brass bg-marine text-on-marine shadow-[0_1px_0_var(--color-marine-deep)]'
        : 'border-dashed border-line text-kelp hover:border-solid hover:bg-reef hover:text-foam',
    )}
  >
    {children}
  </button>
);
