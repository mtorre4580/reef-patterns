import type { CategoryId } from './types';

export interface Category {
  id: CategoryId;
  label: string;
  description: string;
}

export const categories: Category[] = [
  { id: 'creacional', label: 'Creacional', description: 'Cómo se crean los objetos.' },
  { id: 'estructural', label: 'Estructural', description: 'Cómo se componen objetos y módulos.' },
  {
    id: 'comportamiento',
    label: 'Comportamiento',
    description: 'Cómo se reparten responsabilidades y se comunican los objetos.',
  },
  {
    id: 'arquitectura',
    label: 'Arquitectura',
    description: 'Cómo se organiza una aplicación completa.',
  },
  {
    id: 'resiliencia',
    label: 'Resiliencia',
    description: 'Cómo sobrevivir a fallas, latencia y carga.',
  },
  { id: 'frontend', label: 'Frontend', description: 'Patrones propios de interfaces y React.' },
];

export const categoriesById = new Map(categories.map((c) => [c.id, c]));

export function categoryLabel(id: CategoryId): string {
  return categoriesById.get(id)?.label ?? id;
}
