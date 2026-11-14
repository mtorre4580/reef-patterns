import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import type { Pattern } from '@/content/types';
import { CategoryBadge } from '@/components/CategoryBadge';
import { GofBadge } from '@/components/GofBadge';

export const PatternRow = ({ pattern }: { pattern: Pattern }) => {
  return (
    <li>
      <Link
        to={`/patterns/${pattern.id}`}
        viewTransition
        className="group flex items-center gap-3 rounded-control px-3 py-3 transition-colors duration-150 hover:bg-trench"
      >
        <span className="w-7 shrink-0 font-mono text-sm text-kelp tabular-nums">
          {pattern.rank}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-medium text-foam">{pattern.name}</span>
          <span className="block truncate text-sm text-kelp">{pattern.summary}</span>
          <CategoryBadge category={pattern.category} className="mt-1 sm:hidden" />
        </span>
        <span className="hidden w-36 shrink-0 sm:block">
          <CategoryBadge category={pattern.category} />
        </span>
        <span className="hidden w-10 shrink-0 sm:block">{pattern.gof && <GofBadge />}</span>
        <ChevronRight
          aria-hidden
          className="size-4 shrink-0 text-kelp transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-foam"
        />
      </Link>
    </li>
  );
};
