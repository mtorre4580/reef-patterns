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
      <header className="wood nailed sticky top-[60px] z-[1] flex items-baseline gap-3 rounded-panel border border-wood-deep px-6 py-3 shadow-[0_6px_14px_-8px_rgb(0_0_0/0.7)]">
        <h2 id={headingId} className="text-xl text-on-wood">
          {t(`tiers.${zone.tier}.zone`)}
          <span className="font-mono text-sm text-on-wood-muted"> · {zone.depth}</span>
        </h2>
        <span className="text-sm text-on-wood-muted">{t(`tiers.${zone.tier}.label`)}</span>
      </header>
      <ol className="parchment -mt-2 flex flex-col rounded-b-panel px-2 pt-4 pb-2">
        {patterns.map((p) => (
          <PatternRow key={p.id} pattern={p} />
        ))}
      </ol>
    </section>
  );
};
