/** Number generator in [0, 1). Injected so randomness can be tested. */
export type Rng = () => number;

export const defaultRng: Rng = Math.random;

/** Deterministic RNG (mulberry32), handy in tests. */
export function seededRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Index in [0, length) from an rng, tolerant of edge values. */
export function randomIndex(length: number, rng: Rng = defaultRng): number {
  return Math.min(length - 1, Math.max(0, Math.floor(rng() * length)));
}
