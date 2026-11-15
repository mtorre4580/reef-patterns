import { Search, X } from 'lucide-react';
import { categories } from '@/content/categories';
import { tiers } from '@/content/tiers';
import type { CategoryId, Tier } from '@/content/types';
import { categoryDotClass } from '@/components/category-colors';
import { RopeChip } from '@/components/RopeChip';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n';
import { cn } from '@/lib/utils';
import { hasActiveFilters, toggleItem, emptyFilters, type CatalogFilters } from './filters';

interface FilterBarProps {
  filters: CatalogFilters;
  onChange: (patch: Partial<CatalogFilters>) => void;
  resultCount: number;
}

export const FilterBar = ({ filters, onChange, resultCount }: FilterBarProps) => {
  const { t } = useI18n();
  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-kelp"
        />
        <input
          type="search"
          value={filters.query}
          onChange={(e) => onChange({ query: e.target.value })}
          placeholder={t('catalog.searchPlaceholder')}
          aria-label={t('catalog.searchLabel')}
          className="parchment h-11 w-full rounded-full pr-4 pl-10 text-sm text-foam placeholder:text-kelp focus-visible:border-biolum"
        />
      </div>

      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">{t('catalog.categoryLegend')}</legend>
        {categories.map((c) => (
          <RopeChip
            key={c.id}
            pressed={filters.categories.includes(c.id)}
            onClick={() =>
              onChange({ categories: toggleItem<CategoryId>(filters.categories, c.id) })
            }
          >
            <span aria-hidden className={cn('size-2 rounded-full', categoryDotClass[c.id])} />
            {t(`categories.${c.id}.label`)}
          </RopeChip>
        ))}
      </fieldset>

      <div className="flex flex-wrap items-center gap-2">
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">{t('catalog.tierLegend')}</legend>
          {tiers.map((tier) => (
            <RopeChip
              key={tier.tier}
              pressed={filters.tiers.includes(tier.tier)}
              onClick={() => onChange({ tiers: toggleItem<Tier>(filters.tiers, tier.tier) })}
            >
              {t(`tiers.${tier.tier}.label`)}
            </RopeChip>
          ))}
        </fieldset>
        <RopeChip pressed={filters.gofOnly} onClick={() => onChange({ gofOnly: !filters.gofOnly })}>
          {t('catalog.gofOnly')}
        </RopeChip>
        {hasActiveFilters(filters) && (
          <Button variant="ghost" size="sm" onClick={() => onChange(emptyFilters)}>
            <X /> {t('catalog.clearFilters')}
          </Button>
        )}
        <p className="ml-auto text-sm text-kelp" aria-live="polite">
          {t('catalog.count', { count: resultCount })}
        </p>
      </div>
    </div>
  );
};
