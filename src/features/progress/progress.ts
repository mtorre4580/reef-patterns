import type { Challenge, Pattern, Tier } from '@/content/types';

export const PROGRESS_KEY = 'reef-patterns:progress';

export interface ProgressState {
  completed: string[];
}

export type ProgressAction = { type: 'complete'; challengeId: string } | { type: 'reset' };

export function progressReducer(state: ProgressState, action: ProgressAction): ProgressState {
  switch (action.type) {
    case 'complete':
      return state.completed.includes(action.challengeId)
        ? state
        : { completed: [...state.completed, action.challengeId] };
    case 'reset':
      return { completed: [] };
  }
}

export function parseProgress(raw: unknown): ProgressState {
  if (raw && typeof raw === 'object' && Array.isArray((raw as ProgressState).completed)) {
    return { completed: (raw as ProgressState).completed.filter((x) => typeof x === 'string') };
  }
  return { completed: [] };
}

/** Zonas cuyos challenges están todos resueltos (solo zonas que tienen challenges). */
export function completedZones(
  patterns: readonly Pattern[],
  challengesByPattern: ReadonlyMap<string, Challenge[]>,
  completed: ReadonlySet<string>,
): Tier[] {
  const byTier = new Map<Tier, Challenge[]>();
  for (const p of patterns) {
    const list = challengesByPattern.get(p.id) ?? [];
    byTier.set(p.tier, [...(byTier.get(p.tier) ?? []), ...list]);
  }
  return [...byTier]
    .filter(([, list]) => list.length > 0 && list.every((c) => completed.has(c.id)))
    .map(([tier]) => tier)
    .sort();
}
