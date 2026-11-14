import { useMemo } from 'react';
import { patterns } from '@/content';
import { tiers } from '@/content/tiers';
import { DepthGauge } from '@/components/DepthGauge';
import { useI18n } from '@/i18n';
import { createPatternSearch } from '@/lib/search';
import { useDocumentTitle } from '@/lib/useDocumentTitle';
import { matchesFilters } from './filters';
import { FilterBar } from './FilterBar';
import { useCatalogFilters } from './useCatalogFilters';
import { ZoneSection } from './ZoneSection';

export const CatalogPage = () => {
  useDocumentTitle(null);
  const { t, locale } = useI18n();
  const search = useMemo(
    () => createPatternSearch(patterns, locale, (id) => t(`categories.${id}.label`)),
    [t, locale],
  );
  const { filters, update } = useCatalogFilters();

  const visible = useMemo(() => {
    const matched = new Set(search.search(filters.query).map((p) => p.id));
    return patterns.filter((p) => matched.has(p.id) && matchesFilters(p, filters));
  }, [filters, search]);

  const zones = useMemo(
    () =>
      tiers
        .map((zone) => ({ zone, items: visible.filter((p) => p.tier === zone.tier) }))
        .filter((z) => z.items.length > 0),
    [visible],
  );
  const visibleZones = useMemo(() => zones.map((z) => z.zone), [zones]);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-24 sm:px-6 lg:pr-36">
      <div className="py-10 sm:py-14">
        <p className="font-mono text-sm text-kelp">{t('catalog.eyebrow')}</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          {t('catalog.title')}
        </h1>
        <p className="mt-3 max-w-2xl text-kelp">{t('catalog.intro')}</p>
      </div>

      <FilterBar filters={filters} onChange={update} resultCount={visible.length} />

      <div className="mt-8 flex flex-col gap-10">
        {zones.map(({ zone, items }) => (
          <ZoneSection key={zone.tier} zone={zone} patterns={items} />
        ))}
        {zones.length === 0 && (
          <p role="status" className="rounded-panel border border-line p-8 text-center text-kelp">
            {t('catalog.empty')}
          </p>
        )}
      </div>

      {visibleZones.length > 0 && <DepthGauge zones={visibleZones} />}
    </div>
  );
};
