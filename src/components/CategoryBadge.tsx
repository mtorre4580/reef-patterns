import { useI18n } from '@/i18n';
import type { CategoryId } from '@/content/types';
import { cn } from '@/lib/utils';
import { categoryDotClass } from './category-colors';

interface CategoryBadgeProps {
  category: CategoryId;
  className?: string;
}

/** Color dot + text: category is never conveyed by color alone. */
export const CategoryBadge = ({ category, className }: CategoryBadgeProps) => {
  const { t } = useI18n();
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs text-kelp', className)}>
      <span aria-hidden className={cn('size-2 rounded-full', categoryDotClass[category])} />
      {t(`categories.${category}.label`)}
    </span>
  );
};
