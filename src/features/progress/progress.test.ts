import { patterns } from '@/content';
import type { Challenge } from '@/content/types';
import { completedZones, parseProgress, progressReducer } from './progress';

describe('progreso', () => {
  it('marca completados sin duplicar', () => {
    let state = progressReducer({ completed: [] }, { type: 'complete', challengeId: 'a-1' });
    state = progressReducer(state, { type: 'complete', challengeId: 'a-1' });
    expect(state.completed).toEqual(['a-1']);
    expect(progressReducer(state, { type: 'reset' }).completed).toEqual([]);
  });

  it('tolera datos corruptos en localStorage', () => {
    expect(parseProgress('basura')).toEqual({ completed: [] });
    expect(parseProgress({ completed: ['x', 3] })).toEqual({ completed: ['x'] });
  });

  it('detecta zonas completadas', () => {
    const ch = (id: string, patternId: string) => ({ id, patternId }) as Challenge;
    const map = new Map([
      ['strategy', [ch('strategy-1', 'strategy')]],
      ['composite', [ch('composite-1', 'composite')]],
    ]);
    expect(completedZones(patterns, map, new Set(['strategy-1']))).toEqual([1]);
    expect(completedZones(patterns, map, new Set(['strategy-1', 'composite-1']))).toEqual([1, 2]);
  });
});
