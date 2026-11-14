import type { Challenge } from '@/content/types';
import { defaultRng, randomIndex, type Rng } from '@/lib/random';

/**
 * Elige un challenge del pool. Prioriza los no completados; si están todos completos, elige
 * entre todos. Es pura: el rng se inyecta.
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
