import Fuse, { type IFuseOptions } from 'fuse.js';
import type { Pattern } from '@/content/types';
import { categoryLabel } from '@/content/categories';

interface SearchDoc {
  pattern: Pattern;
  name: string;
  nameEs: string;
  summary: string;
  category: string;
}

const options: IFuseOptions<SearchDoc> = {
  keys: [
    { name: 'name', weight: 3 },
    { name: 'nameEs', weight: 2 },
    { name: 'category', weight: 1 },
    { name: 'summary', weight: 0.6 },
  ],
  threshold: 0.38,
  ignoreLocation: true,
  includeScore: true,
};

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

export interface PatternSearch {
  search(query: string): Pattern[];
}

/** Índice difuso sobre nombre, nombre en español, categoría y resumen. Ignora tildes. */
export function createPatternSearch(patterns: Pattern[]): PatternSearch {
  const docs = patterns.map<SearchDoc>((pattern) => ({
    pattern,
    name: normalize(pattern.name),
    nameEs: normalize(pattern.nameEs),
    summary: normalize(pattern.summary),
    category: normalize(categoryLabel(pattern.category)),
  }));
  const fuse = new Fuse(docs, options);

  return {
    search(query) {
      const q = normalize(query.trim());
      if (!q) return patterns;
      return fuse.search(q).map((r) => r.item.pattern);
    },
  };
}
