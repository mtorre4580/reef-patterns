import type { CategoryId } from '@/content/types';
import { categoryLabel } from '@/content/categories';
import { cn } from '@/lib/utils';
import { categoryDotClass } from './category-colors';

interface CategoryBadgeProps {
  category: CategoryId;
  className?: string;
}

/** Punto de color + texto: la categoría nunca se comunica solo por color. */
export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs text-kelp', className)}>
      <span aria-hidden className={cn('size-2 rounded-full', categoryDotClass[category])} />
      {categoryLabel(category)}
    </span>
  );
}
