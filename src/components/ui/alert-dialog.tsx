import { AlertDialog as Primitive } from 'radix-ui';
import type { ReactNode } from 'react';
import { useI18n } from '@/i18n';
import { buttonVariants } from './button-variants';

interface ConfirmDialogProps {
  trigger: ReactNode;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
}

/** Accessible confirmation dialog (Radix AlertDialog) with the site theme. */
export const ConfirmDialog = ({
  trigger,
  title,
  description,
  confirmLabel,
  onConfirm,
}: ConfirmDialogProps) => {
  const { t } = useI18n();
  return (
    <Primitive.Root>
      <Primitive.Trigger asChild>{trigger}</Primitive.Trigger>
      <Primitive.Portal>
        <Primitive.Overlay className="fixed inset-0 z-40 bg-abyss/70 backdrop-blur-sm" />
        <Primitive.Content className="fixed top-1/2 left-1/2 z-50 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 animate-fade-in rounded-panel border border-line bg-trench p-6">
          <Primitive.Title className="text-lg font-semibold">{title}</Primitive.Title>
          <Primitive.Description className="mt-2 text-sm text-kelp">
            {description}
          </Primitive.Description>
          <div className="mt-6 flex justify-end gap-2">
            <Primitive.Cancel className={buttonVariants({ variant: 'ghost' })}>
              {t('common.cancel')}
            </Primitive.Cancel>
            <Primitive.Action
              className={buttonVariants({ variant: 'primary' })}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Primitive.Action>
          </div>
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  );
};
