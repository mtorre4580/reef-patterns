import { Tabs as TabsPrimitive } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export const Tabs = TabsPrimitive.Root;

export const TabsList = ({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) => {
  return (
    <TabsPrimitive.List
      className={cn('flex items-center gap-1 border-b border-line px-2', className)}
      {...props}
    />
  );
};

export const TabsTrigger = ({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) => {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        '-mb-px inline-flex h-10 items-center gap-2 border-b-2 border-transparent px-3 text-sm text-kelp transition-colors hover:text-foam data-[state=active]:border-biolum data-[state=active]:text-foam',
        className,
      )}
      {...props}
    />
  );
};

export const TabsContent = ({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) => {
  return <TabsPrimitive.Content className={cn('outline-none', className)} {...props} />;
};
