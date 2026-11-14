import type { CategoryId, Pattern, Tier } from '@/content/types';
import { categoriesById } from '@/content/categories';

export interface CatalogFilters {
  categories: CategoryId[];
  tiers: Tier[];
  gofOnly: boolean;
  query: string;
}

export const emptyFilters: CatalogFilters = {
  categories: [],
  tiers: [],
  gofOnly: false,
  query: '',
};

const splitList = (value: string | null) => (value ? value.split(',').filter(Boolean) : []);

/** Lee los filtros desde la URL (?cat=a,b&tier=1,2&gof=1&q=texto), ignorando valores inválidos. */
export function parseFilters(params: URLSearchParams): CatalogFilters {
  const categories = splitList(params.get('cat')).filter((c): c is CategoryId =>
    categoriesById.has(c as CategoryId),
  );
  const tiers = splitList(params.get('tier'))
    .map(Number)
    .filter((t): t is Tier => t === 1 || t === 2 || t === 3 || t === 4);
  return {
    categories: [...new Set(categories)],
    tiers: [...new Set(tiers)].sort(),
    gofOnly: params.get('gof') === '1',
    query: params.get('q') ?? '',
  };
}

export function serializeFilters(filters: CatalogFilters, base = new URLSearchParams()) {
  const params = new URLSearchParams(base);
  const set = (key: string, value: string) => (value ? params.set(key, value) : params.delete(key));
  set('cat', filters.categories.join(','));
  set('tier', [...filters.tiers].sort().join(','));
  set('gof', filters.gofOnly ? '1' : '');
  set('q', filters.query);
  return params;
}

export function hasActiveFilters(filters: CatalogFilters): boolean {
  return (
    filters.categories.length > 0 || filters.tiers.length > 0 || filters.gofOnly || !!filters.query
  );
}

/** Aplica categoría, nivel y GoF. La búsqueda de texto se resuelve aparte con Fuse. */
export function matchesFilters(pattern: Pattern, filters: CatalogFilters): boolean {
  if (filters.categories.length && !filters.categories.includes(pattern.category)) return false;
  if (filters.tiers.length && !filters.tiers.includes(pattern.tier)) return false;
  if (filters.gofOnly && !pattern.gof) return false;
  return true;
}

export function toggleItem<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}
