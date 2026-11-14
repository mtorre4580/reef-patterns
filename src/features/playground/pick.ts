import type { Challenge } from '@/content/types';
import { defaultRng, randomIndex, type Rng } from '@/lib/random';

/**
 * Picks a challenge from the pool. Prefers unsolved ones; if all are solved, picks among
 * all of them. Pure: the rng is injected.
 */
export function pickChallenge(
  pool: readonly Challenge[],
  completedIds: ReadonlySet<string>,
  rng: Rng = defaultRng,
): Challenge | null {
  if (pool.length === 0) return null;
  const pending = pool.filter((c) => !completedIds.has(c.id));
  const candidates = pending.length > 0 ? pending : pool;
  return candidates[randomIndex(candidates.length, rng)] ?? null;
}
