import { useI18n } from '@/i18n';
import type { TierInfo } from '@/content/tiers';
import type { Pattern } from '@/content/types';
import { zoneElementId } from '@/components/depth';
import { PatternRow } from './PatternRow';

interface ZoneSectionProps {
  zone: TierInfo;
  patterns: Pattern[];
}

export const ZoneSection = ({ zone, patterns }: ZoneSectionProps) => {
  const { t } = useI18n();
  const headingId = `${zoneElementId(zone.tier)}-title`;
  return (
    <section id={zoneElementId(zone.tier)} aria-labelledby={headingId} className="scroll-mt-24">
      <header className="sticky top-14 z-[1] -mx-3 flex items-baseline gap-3 bg-abyss/85 px-3 py-3 backdrop-blur-sm">
        <h2 id={headingId} className="text-lg font-semibold tracking-tight">
          {t(`tiers.${zone.tier}.zone`)}
          <span className="font-mono text-sm font-normal text-kelp"> · {zone.depth}</span>
        </h2>
        <span className="text-sm text-kelp">{t(`tiers.${zone.tier}.label`)}</span>
      </header>
      <ol className="flex flex-col">
        {patterns.map((p) => (
          <PatternRow key={p.id} pattern={p} />
        ))}
      </ol>
    </section>
  );
};
