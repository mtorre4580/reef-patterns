import { challengesById, challengesByPattern, patternsById } from '@/content';
import type { Challenge, Pattern } from '@/content/types';

export type Resolution =
  | { kind: 'challenge'; challenge: Challenge; pattern: Pattern }
  | { kind: 'no-challenges'; pattern: Pattern | null }
  | { kind: 'landing' };

/** Decide qué challenge mostrar a partir de ?challenge= o ?pattern=. */
export function resolveChallenge(params: URLSearchParams): Resolution {
  const byId = challengesById.get(params.get('challenge') ?? '');
  if (byId)
    return { kind: 'challenge', challenge: byId, pattern: patternsById.get(byId.patternId)! };

  const patternId = params.get('pattern');
  if (patternId) {
    const pattern = patternsById.get(patternId) ?? null;
    const first = challengesByPattern.get(patternId)?.[0];
    if (pattern && first) return { kind: 'challenge', challenge: first, pattern };
    return { kind: 'no-challenges', pattern };
  }

  // Sin parámetros: el usuario gira el timón para elegir
  return { kind: 'landing' };
}
