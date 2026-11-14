import { patterns } from '@/content';
import { createPatternSearch } from './search';

const search = createPatternSearch(patterns);

describe('createPatternSearch', () => {
  it('returns everything for an empty query', () => {
    expect(search.search('  ')).toHaveLength(patterns.length);
  });

  it('finds by English name despite typos', () => {
    expect(search.search('obsrver')[0]?.id).toBe('observer');
  });

  it('finds by Spanish name without diacritics', () => {
    expect(search.search('fabrica abstracta')[0]?.id).toBe('abstract-factory');
  });

  it('finds by category', () => {
    const ids = search.search('resiliencia').map((p) => p.id);
    expect(ids).toContain('circuit-breaker');
  });
});
