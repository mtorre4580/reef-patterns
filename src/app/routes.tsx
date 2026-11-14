import type { RouteObject } from 'react-router';
import { CatalogPage, PatternDetailPage } from '@/features/catalog';
import { Layout } from './Layout';
import { NotFoundPage } from './NotFoundPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <CatalogPage /> },
      { path: 'patterns/:id', element: <PatternDetailPage /> },
      {
        path: 'playground',
        // Carga diferida: el catálogo nunca descarga Monaco ni el runner
        lazy: async () => ({ Component: (await import('@/features/playground')).PlaygroundPage }),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
