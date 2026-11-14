import { challengesByPattern, patterns } from '@/content';
import { buildPool, defaultHelmFilters } from './pool';

describe('buildPool', () => {
  it('without filters includes every pattern with challenges', () => {
    const { sectors, pool } = buildPool(
      patterns,
      challengesByPattern,
      defaultHelmFilters,
      new Set(),
    );
    expect(sectors.length).toBe(challengesByPattern.size);
    expect(pool.length).toBe([...challengesByPattern.values()].flat().length);
  });

  it('respects tier and category', () => {
    const { sectors, pool } = buildPool(
      patterns,
      challengesByPattern,
      { tiers: [1], categories: ['creacional'], pendingOnly: false },
      new Set(),
    );
    expect(sectors.map((p) => p.id)).toEqual(['factory-method', 'singleton', 'builder']);
    expect(
      pool.every((c) => ['factory-method', 'singleton', 'builder'].includes(c.patternId)),
    ).toBe(true);
  });

  it('unsolved-only drops solved challenges and fully solved patterns', () => {
    const { sectors, pool } = buildPool(
      patterns,
      challengesByPattern,
      { tiers: [], categories: [], pendingOnly: true },
      new Set(['singleton-1', 'singleton-2', 'strategy-1']),
    );
    expect(sectors.some((p) => p.id === 'singleton')).toBe(false);
    expect(pool.some((c) => c.id === 'strategy-1')).toBe(false);
    expect(pool.some((c) => c.id === 'strategy-2')).toBe(true);
  });
});
