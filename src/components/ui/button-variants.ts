import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-control text-sm font-medium whitespace-nowrap transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-lagoon text-lagoon-ink hover:bg-lagoon/90',
        secondary: 'border border-line bg-trench text-foam hover:bg-reef',
        ghost: 'text-kelp hover:bg-reef hover:text-foam',
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
