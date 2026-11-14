import { patterns } from '@/content';
import { matchesFilters, parseFilters, serializeFilters, toggleItem } from './filters';

describe('catalog filters', () => {
  it('parses the URL and ignores invalid values', () => {
    const f = parseFilters(new URLSearchParams('cat=frontend,nope&tier=2,9,1&gof=1&q=hook'));
    expect(f).toEqual({ categories: ['frontend'], tiers: [1, 2], gofOnly: true, query: 'hook' });
  });

  it('round-trips through serialization', () => {
    const f = {
      categories: ['creacional' as const],
      tiers: [3 as const],
      gofOnly: false,
      query: '',
    };
    const params = serializeFilters(f);
    expect(params.toString()).toBe('cat=creacional&tier=3');
    expect(parseFilters(params)).toEqual(f);
  });

  it('combines category, tier and GoF', () => {
    const f = parseFilters(new URLSearchParams('cat=creacional&tier=1&gof=1'));
    const ids = patterns.filter((p) => matchesFilters(p, f)).map((p) => p.id);
    expect(ids).toEqual(['factory-method', 'singleton', 'builder']);
  });

  it('toggleItem adds and removes', () => {
    expect(toggleItem([1, 2], 2)).toEqual([1]);
    expect(toggleItem([1], 2)).toEqual([1, 2]);
  });
});
