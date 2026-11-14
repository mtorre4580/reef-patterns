import { useMemo } from 'react';
import { patterns } from '@/content';
import { tiers } from '@/content/tiers';
import { DepthGauge } from '@/components/DepthGauge';
import { SailingShip } from '@/components/SailingShip';
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
      <div className="relative my-8 overflow-hidden rounded-panel border-2 border-wood-deep sm:my-10">
        <div className="parchment grid items-end gap-4 rounded-none border-0 px-6 pt-8 sm:grid-cols-[1fr_15rem] sm:px-8">
          <div className="pb-12">
            <p className="font-mono text-sm text-kelp">{t('catalog.eyebrow')}</p>
            <h1 className="mt-2 text-3xl leading-tight sm:text-4xl">{t('catalog.title')}</h1>
            <p className="mt-3 max-w-xl text-kelp">{t('catalog.intro')}</p>
          </div>
          <SailingShip className="mx-auto -mb-2 w-48 sm:w-full" />
        </div>
        <div aria-hidden className="sea h-6 motion-safe:animate-waves" />
        <div aria-hidden className="rope h-[7px] rounded-none" />
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
