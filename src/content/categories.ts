import type { CategoryId } from './types';

export interface Category {
  id: CategoryId;
}

/** Category ids in display order. Labels and descriptions live in the i18n messages. */
export const categories: Category[] = [
  { id: 'creacional' },
  { id: 'estructural' },
  { id: 'comportamiento' },
  { id: 'arquitectura' },
  { id: 'resiliencia' },
  { id: 'frontend' },
];

export const categoriesById = new Map(categories.map((c) => [c.id, c]));
