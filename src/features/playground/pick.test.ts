import type { Challenge } from '@/content/types';
import { seededRng } from '@/lib/random';
import { pickChallenge } from './pick';

const make = (id: string): Challenge => ({
  id,
  patternId: id.split('-')[0]!,
  title: { en: id, es: id, 'pt-BR': id },
  difficulty: 'facil',
  story: { en: '', es: '', 'pt-BR': '' },
  instructions: { en: '', es: '', 'pt-BR': '' },
  starterCode: '',
  tests: [],
  hints: { en: [], es: [], 'pt-BR': [] },
  solution: '',
});

const pool = ['observer-1', 'observer-2', 'strategy-1', 'singleton-1'].map(make);

describe('pickChallenge', () => {
  it('returns null for an empty pool', () => {
    expect(pickChallenge([], new Set(), () => 0.5)).toBeNull();
  });

  it('uses the injected rng', () => {
    expect(pickChallenge(pool, new Set(), () => 0)?.id).toBe('observer-1');
    expect(pickChallenge(pool, new Set(), () => 0.5)?.id).toBe('strategy-1');
    expect(pickChallenge(pool, new Set(), () => 0.9999999)?.id).toBe('singleton-1');
  });

  it('tolerates an rng that returns exactly 1', () => {
    expect(pickChallenge(pool, new Set(), () => 1)?.id).toBe('singleton-1');
  });

  it('prefers unsolved challenges', () => {
    const completed = new Set(['observer-1', 'observer-2', 'strategy-1']);
    for (const value of [0, 0.3, 0.7, 0.99]) {
      expect(pickChallenge(pool, completed, () => value)?.id).toBe('singleton-1');
    }
  });

  it('picks among all when every challenge is solved', () => {
    const completed = new Set(pool.map((c) => c.id));
    expect(pickChallenge(pool, completed, () => 0.5)?.id).toBe('strategy-1');
  });

  it('with a seeded rng, never picks a solved one while unsolved remain', () => {
    const rng = seededRng(42);
    const completed = new Set(['observer-1', 'strategy-1']);
    for (let i = 0; i < 200; i++) {
      expect(completed.has(pickChallenge(pool, completed, rng)!.id)).toBe(false);
    }
  });
});
