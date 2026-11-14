import type { Challenge } from '@/content/types';
import { seededRng } from '@/lib/random';
import { pickChallenge } from './pick';

const make = (id: string): Challenge => ({
  id,
  patternId: id.split('-')[0]!,
  title: id,
  difficulty: 'facil',
  story: '',
  instructions: '',
  starterCode: '',
  tests: [],
  hints: [],
  solution: '',
});

const pool = ['observer-1', 'observer-2', 'strategy-1', 'singleton-1'].map(make);

describe('pickChallenge', () => {
  it('devuelve null con un pool vacío', () => {
    expect(pickChallenge([], new Set(), () => 0.5)).toBeNull();
  });

  it('usa el rng inyectado', () => {
    expect(pickChallenge(pool, new Set(), () => 0)?.id).toBe('observer-1');
    expect(pickChallenge(pool, new Set(), () => 0.5)?.id).toBe('strategy-1');
    expect(pickChallenge(pool, new Set(), () => 0.9999999)?.id).toBe('singleton-1');
  });

  it('tolera un rng que devuelve exactamente 1', () => {
    expect(pickChallenge(pool, new Set(), () => 1)?.id).toBe('singleton-1');
  });

  it('prioriza los pendientes', () => {
    const completed = new Set(['observer-1', 'observer-2', 'strategy-1']);
    for (const value of [0, 0.3, 0.7, 0.99]) {
      expect(pickChallenge(pool, completed, () => value)?.id).toBe('singleton-1');
    }
  });

  it('si están todos completos, elige entre todos', () => {
    const completed = new Set(pool.map((c) => c.id));
    expect(pickChallenge(pool, completed, () => 0.5)?.id).toBe('strategy-1');
  });

  it('con un rng con semilla, nunca elige un completado mientras haya pendientes', () => {
    const rng = seededRng(42);
    const completed = new Set(['observer-1', 'strategy-1']);
    for (let i = 0; i < 200; i++) {
      expect(completed.has(pickChallenge(pool, completed, rng)!.id)).toBe(false);
    }
  });
});
