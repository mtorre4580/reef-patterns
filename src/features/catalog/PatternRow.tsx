import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import type { Pattern } from '@/content/types';
import { CategoryBadge } from '@/components/CategoryBadge';
import { GofBadge } from '@/components/GofBadge';
import { useI18n } from '@/i18n';

export const PatternRow = ({ pattern }: { pattern: Pattern }) => {
  const { locale } = useI18n();
  return (
    <li>
      <Link
        to={`/patterns/${pattern.id}`}
        // eslint-disable-next-line @typescript-eslint/no-deprecated -- TODO: migrate to React <ViewTransition>
        viewTransition
        className="group relative flex items-center gap-3 rounded-control px-3 py-3 transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-reef"
      >
        {/* Brass coin with the rank; it turns like a coin on hover */}
        <span className="brass flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-xs tabular-nums transition-transform duration-300 group-hover:[transform:rotateY(180deg)]">
          <span className="group-hover:[transform:rotateY(180deg)]">{pattern.rank}</span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-lg leading-tight text-foam">{pattern.name}</span>
          <span className="block truncate text-sm text-kelp">{pattern.summary[locale]}</span>
          <CategoryBadge category={pattern.category} className="mt-1 sm:hidden" />
        </span>
        <span className="hidden w-36 shrink-0 sm:block">
          <CategoryBadge category={pattern.category} />
        </span>
        <span className="hidden w-10 shrink-0 sm:block">{pattern.gof && <GofBadge />}</span>
        <ChevronRight
          aria-hidden
          className="size-4 shrink-0 text-kelp transition-transform duration-200 group-hover:translate-x-1 group-hover:text-foam"
        />
        {/* A rope slides in under the hovered row */}
        <span
          aria-hidden
          className="rope absolute inset-x-3 -bottom-px h-[3px] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100"
        />
      </Link>
    </li>
  );
};
