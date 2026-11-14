import { X } from 'lucide-react';
import { Dialog as Primitive } from 'radix-ui';
import type { ReactNode } from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
}

export const Dialog = ({ open, onOpenChange, title, description, children }: DialogProps) => {
  return (
    <Primitive.Root open={open} onOpenChange={onOpenChange}>
      <Primitive.Portal>
        <Primitive.Overlay className="fixed inset-0 z-40 bg-abyss/70 backdrop-blur-sm" />
        <Primitive.Content className="fixed top-1/2 left-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[min(34rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 animate-fade-in overflow-y-auto rounded-panel border border-line bg-trench p-6">
          <Primitive.Title className="text-lg font-semibold">{title}</Primitive.Title>
          {description ? (
            <Primitive.Description className="mt-1 text-sm text-kelp">
              {description}
            </Primitive.Description>
          ) : (
            <Primitive.Description className="sr-only">{title}</Primitive.Description>
          )}
          <div className="mt-4">{children}</div>
          <Primitive.Close
            aria-label="Cerrar"
            className="absolute top-4 right-4 rounded-control p-1 text-kelp hover:bg-reef hover:text-foam"
          >
            <X className="size-4" />
          </Primitive.Close>
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  );
};
