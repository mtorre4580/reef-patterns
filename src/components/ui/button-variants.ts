import { cva } from 'class-variance-authority';

/**
 * Buttons look like ship fittings: a navy-painted plate with white lettering (primary),
 * varnished wood (secondary) or bare (ghost). They lift slightly on hover and sink when
 * pressed.
 */
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-control text-sm font-medium whitespace-nowrap transition-[color,background-color,box-shadow,transform] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'border border-marine-deep bg-marine bg-[linear-gradient(180deg,rgb(255_255_255/0.14),transparent_55%)] text-on-marine shadow-[inset_0_1px_0_rgb(255_255_255/0.22),0_2px_0_var(--color-marine-deep),0_3px_6px_-2px_rgb(0_0_0/0.45)] hover:-translate-y-px hover:bg-marine-hover active:translate-y-px active:shadow-[inset_0_1px_0_rgb(255_255_255/0.22),0_1px_0_var(--color-marine-deep)]',
        secondary:
          'wood border border-wood-deep shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_2px_0_var(--color-wood-deep)] hover:brightness-110 active:shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_1px_0_var(--color-wood-deep)]',
        ghost: 'text-kelp hover:bg-reef hover:text-foam',
        onWood: 'text-on-wood-muted hover:bg-black/20 hover:text-on-wood',
        danger: 'border border-coral/50 text-coral hover:bg-coral/10',
      },
      size: {
        sm: 'h-8 px-3',
        md: 'h-9 px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: { variant: 'secondary', size: 'md' },
  },
);
