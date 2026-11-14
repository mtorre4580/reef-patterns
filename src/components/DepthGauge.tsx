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
      {/* Brass plate with the current reading */}
      <div
        role="meter"
        aria-label={t('gauge.meter')}
        aria-valuemin={0}
        aria-valuemax={MAX_GAUGE_DEPTH}
        aria-valuenow={meters}
        aria-valuetext={`${meters} m, ${zoneName}`}
        className="brass mb-3 rounded-control px-2.5 py-1.5 text-right"
      >
        <p className="font-mono text-lg leading-none tabular-nums">{meters} m</p>
        <p className="mt-0.5 font-display text-xs">{zoneName}</p>
      </div>

      {/* Sounding line: the rope pays out as you go deeper, with a lead weight at its end */}
      <div className="relative w-20 flex-1">
        <div
          aria-hidden
          className="absolute top-0 right-[10px] bottom-0 border-r border-dashed border-line"
        />
        <div
          aria-hidden
          className="rope-v absolute top-0 right-[7px] transition-[height] duration-200"
          style={{ height: `${position * 100}%` }}
        />
        <svg
          aria-hidden
          viewBox="0 0 20 28"
          className="absolute right-0 w-5 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] transition-[top] duration-200"
          style={{ top: `calc(${position * 100}% - 2px)` }}
        >
          <circle
            cx="10"
            cy="3"
            r="2.5"
            fill="none"
            stroke="var(--color-rope-dark)"
            strokeWidth="1.4"
          />
          <path d="M10 5 C 16 10 17 18 17 21 A 7 7 0 0 1 3 21 C 3 18 4 10 10 5 Z" fill="#6f7a84" />
          <path
            d="M8 10 C 6 13 6 17 6.5 20"
            stroke="#c4ccd3"
            strokeOpacity="0.6"
            strokeWidth="1.2"
            fill="none"
          />
        </svg>
        <ol className="relative h-full">
          {zones.map((zone) => (
            <li
              key={zone.tier}
              className="absolute right-6"
              style={{ top: `calc(${(zone.minDepth / MAX_GAUGE_DEPTH) * 100}% - 0.7em)` }}
            >
              <button
                type="button"
                onClick={() => scrollToId(zoneElementId(zone.tier))}
                className={cn(
                  'block rounded-control border px-1.5 py-px text-right font-mono text-[0.7rem] whitespace-nowrap transition-colors',
                  reading.zone?.tier === zone.tier
                    ? 'border-brass bg-lagoon text-lagoon-ink'
                    : 'border-line bg-trench text-kelp hover:text-foam',
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
