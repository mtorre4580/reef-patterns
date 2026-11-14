import type { CategoryId, Challenge, Pattern, Tier } from '@/content/types';

export interface HelmFilters {
  tiers: Tier[];
  categories: CategoryId[];
  pendingOnly: boolean;
}

export const defaultHelmFilters: HelmFilters = { tiers: [], categories: [], pendingOnly: false };

/** Patrones que pasan los filtros y tienen challenges; el pool son sus challenges. */
export function buildPool(
  patterns: readonly Pattern[],
  challengesByPattern: ReadonlyMap<string, Challenge[]>,
  filters: HelmFilters,
  completed: ReadonlySet<string>,
) {
  const sectors: Pattern[] = [];
  const pool: Challenge[] = [];
  for (const p of patterns) {
    if (filters.tiers.length && !filters.tiers.includes(p.tier)) continue;
    if (filters.categories.length && !filters.categories.includes(p.category)) continue;
    const list = (challengesByPattern.get(p.id) ?? []).filter(
      (c) => !filters.pendingOnly || !completed.has(c.id),
    );
    if (list.length === 0) continue;
    sectors.push(p);
    pool.push(...list);
  }
  return { sectors, pool };
}
