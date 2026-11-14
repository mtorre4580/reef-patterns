import { Award, Compass } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { challengesByPattern, patterns } from '@/content';
import { categories } from '@/content/categories';
import { tierInfo, tiers } from '@/content/tiers';
import type { CategoryId, Challenge, Tier } from '@/content/types';
import { Helm, type HelmSpin } from '@/components/Helm';
import { Button } from '@/components/ui/button';
import { useProgress, completedZones } from '@/features/progress';
import { defaultRng, type Rng } from '@/lib/random';
import { cn } from '@/lib/utils';
import { difficultyLabel } from './labels';
import { pickChallenge } from './pick';
import { buildPool, defaultHelmFilters, type HelmFilters } from './pool';

interface HelmPanelProps {
  onChoose: (challenge: Challenge) => void;
  rng?: Rng;
}

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

function Chip({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        'h-7 rounded-control border px-2.5 text-xs transition-colors',
        pressed ? 'border-lagoon bg-lagoon/15 text-foam' : 'border-line text-kelp hover:text-foam',
      )}
    >
      {children}
    </button>
  );
}

/** Filtros + timón + resultado. El challenge se elige antes de animar. */
export function HelmPanel({ onChoose, rng = defaultRng }: HelmPanelProps) {
  const { completed } = useProgress();
  const [filters, setFilters] = useState<HelmFilters>(defaultHelmFilters);
  const [spin, setSpin] = useState<(HelmSpin & { challenge: Challenge }) | null>(null);
  const [settledKey, setSettledKey] = useState<number | null>(null);

  const { sectors, pool } = useMemo(
    () => buildPool(patterns, challengesByPattern, filters, completed),
    [filters, completed],
  );
  const zones = useMemo(
    () => completedZones(patterns, challengesByPattern, completed),
    [completed],
  );
  const totalChallenges = useMemo(() => [...challengesByPattern.values()].flat().length, []);

  const update = (patch: Partial<HelmFilters>) => {
    setFilters((f) => ({ ...f, ...patch }));
    setSpin(null);
    setSettledKey(null);
  };

  const doSpin = () => {
    const challenge = pickChallenge(pool, completed, rng);
    if (!challenge) return;
    const index = sectors.findIndex((p) => p.id === challenge.patternId);
    setSettledKey(null);
    setSpin((prev) => ({ key: (prev?.key ?? 0) + 1, index, challenge }));
  };

  const onSettled = useCallback((key: number) => setSettledKey(key), []);
  const result = spin && settledKey === spin.key ? spin.challenge : null;
  const resultPattern = result ? patterns.find((p) => p.id === result.patternId) : null;
  const spinning = !!spin && settledKey !== spin.key;

  return (
    <div className="flex flex-col gap-5">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-xs text-kelp">Zonas</legend>
        <div className="flex flex-wrap gap-1.5">
          {tiers.map((t) => (
            <Chip
              key={t.tier}
              pressed={filters.tiers.includes(t.tier)}
              onClick={() => update({ tiers: toggle<Tier>(filters.tiers, t.tier) })}
            >
              {t.zone}
            </Chip>
          ))}
          <Chip
            pressed={filters.pendingOnly}
            onClick={() => update({ pendingOnly: !filters.pendingOnly })}
          >
            Solo pendientes
          </Chip>
        </div>
      </fieldset>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-xs text-kelp">Categorías</legend>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <Chip
              key={c.id}
              pressed={filters.categories.includes(c.id)}
              onClick={() => update({ categories: toggle<CategoryId>(filters.categories, c.id) })}
            >
              {c.label}
            </Chip>
          ))}
        </div>
      </fieldset>

      {sectors.length > 0 ? (
        <>
          <Helm
            sectors={sectors.map((p) => ({ id: p.id, label: p.name }))}
            spin={spin}
            onSpin={doSpin}
            onSettled={onSettled}
            spinning={spinning}
          />
          <p className="text-center text-xs text-kelp">
            {sectors.length} {sectors.length === 1 ? 'patrón' : 'patrones'} · {pool.length}{' '}
            {pool.length === 1 ? 'challenge' : 'challenges'} en juego. Hacé clic en el timón o
            enfocalo y presioná Enter.
          </p>
        </>
      ) : (
        <p
          role="status"
          className="rounded-panel border border-line p-6 text-center text-sm text-kelp"
        >
          No quedan challenges con estos filtros. Probá con otras zonas o categorías.
        </p>
      )}

      <div aria-live="polite" className="min-h-6">
        {result && resultPattern && (
          <div className="flex flex-col items-center gap-3 rounded-panel border border-lagoon/40 bg-lagoon/10 p-4 text-center">
            <p className="text-sm">
              Te tocó <strong>{resultPattern.name}</strong>: {result.title}
              <span className="text-kelp"> · {difficultyLabel[result.difficulty]}</span>
              {completed.has(result.id) && <span className="text-kelp"> (ya resuelto)</span>}
            </p>
            <Button variant="primary" size="sm" onClick={() => onChoose(result)} autoFocus>
              <Compass aria-hidden /> Empezar challenge
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-line pt-4">
        <p className="text-xs text-kelp">
          Progreso: {completed.size} de {totalChallenges} challenges resueltos
        </p>
        {zones.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {zones.map((tier) => (
              <li
                key={tier}
                className="inline-flex items-center gap-1.5 rounded-control border border-anemone/40 px-2 py-1 text-xs text-anemone"
              >
                <Award aria-hidden className="size-3.5" /> Zona {tierInfo(tier).zone} completada
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
