import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function Kbd({ className, ...props }: ComponentProps<'kbd'>) {
  return (
    <kbd
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded border border-line bg-reef px-1 font-mono text-[0.7rem] text-kelp',
        className,
      )}
      {...props}
    />
  );
}
