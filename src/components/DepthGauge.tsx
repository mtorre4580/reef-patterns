import { useEffect, useState } from 'react';
import type { TierInfo } from '@/content/tiers';
import { scrollToId } from '@/lib/scrollToId';
import { useI18n } from '@/i18n';
import { cn } from '@/lib/utils';
import { computeDepth, MAX_GAUGE_DEPTH, zoneElementId, type DepthReading } from './depth';

interface DepthGaugeProps {
  zones: TierInfo[];
}

/** Side depth gauge: marks the current zone and darkens the background with depth. */
export const DepthGauge = ({ zones }: DepthGaugeProps) => {
  const { t } = useI18n();
  const [reading, setReading] = useState<DepthReading>({
    depth: zones[0]?.minDepth ?? 0,
    zone: zones[0] ?? null,
  });

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rects = zones.map((z) => {
          const el = document.getElementById(zoneElementId(z.tier));
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { top: r.top, height: r.height };
        });
        const next = computeDepth(zones, rects, window.innerHeight * 0.35);
        setReading(next);
        document.documentElement.style.setProperty(
          '--depth',
          (next.depth / MAX_GAUGE_DEPTH).toFixed(3),
        );
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      document.documentElement.style.setProperty('--depth', '0');
    };
  }, [zones]);

  const meters = Math.round(reading.depth);
  const zoneName = reading.zone ? t(`tiers.${reading.zone.tier}.zone`) : '';
  const position = Math.min(1, reading.depth / MAX_GAUGE_DEPTH);

  return (
    <aside
      aria-label={t('gauge.label')}
      className="fixed top-24 right-6 bottom-10 z-10 hidden w-24 flex-col items-end lg:flex"
    >
      <div
        role="meter"
        aria-label={t('gauge.meter')}
        aria-valuemin={0}
        aria-valuemax={MAX_GAUGE_DEPTH}
        aria-valuenow={meters}
        aria-valuetext={`${meters} m, ${zoneName}`}
        className="mb-3 text-right"
      >
        <p className="font-mono text-lg text-foam tabular-nums">{meters} m</p>
        <p className="text-xs text-kelp">{zoneName}</p>
      </div>

      <div className="relative flex-1 pr-1">
        <div aria-hidden className="absolute top-0 right-[7px] bottom-0 w-px bg-line" />
        <div
          aria-hidden
          className="absolute right-0.5 size-[11px] rounded-full border-2 border-biolum bg-abyss transition-[top] duration-200"
          style={{ top: `calc(${position * 100}% - 5px)` }}
        />
        <ol className="relative h-full">
          {zones.map((zone) => (
            <li
              key={zone.tier}
              className="absolute right-5"
              style={{ top: `calc(${(zone.minDepth / MAX_GAUGE_DEPTH) * 100}% - 0.6em)` }}
            >
              <button
                type="button"
                onClick={() => scrollToId(zoneElementId(zone.tier))}
                className={cn(
                  'block rounded-control px-1 text-right font-mono text-[0.7rem] whitespace-nowrap transition-colors hover:text-foam',
                  reading.zone?.tier === zone.tier ? 'text-biolum' : 'text-kelp',
                )}
              >
                {zone.minDepth} m
                <span className="sr-only">
                  {t('gauge.goTo', { zone: t(`tiers.${zone.tier}.zone`) })}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
};
