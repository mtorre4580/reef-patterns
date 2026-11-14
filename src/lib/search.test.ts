import { patterns } from '@/content';
import { createPatternSearch } from './search';

const search = createPatternSearch(patterns);

describe('createPatternSearch', () => {
  it('devuelve todo con una consulta vacía', () => {
    expect(search.search('  ')).toHaveLength(patterns.length);
  });

  it('encuentra por nombre en inglés con errores de tipeo', () => {
    expect(search.search('obsrver')[0]?.id).toBe('observer');
  });

  it('encuentra por nombre en español sin tildes', () => {
    expect(search.search('fabrica abstracta')[0]?.id).toBe('abstract-factory');
  });

  it('encuentra por categoría', () => {
    const ids = search.search('resiliencia').map((p) => p.id);
    expect(ids).toContain('circuit-breaker');
  });
});
