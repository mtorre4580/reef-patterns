import type { RouteObject } from 'react-router';
import { CatalogLayout, CatalogPage, PatternDetailPage } from '@/features/catalog';
import { Layout } from './Layout';
import { NotFoundPage } from './NotFoundPage';
import { PageLoading } from './PageLoading';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        // Pathless layout: wraps catalog and detail in one <ViewTransition> boundary
        element: <CatalogLayout />,
        children: [
          { index: true, element: <CatalogPage /> },
          { path: 'patterns/:id', element: <PatternDetailPage /> },
        ],
      },
      {
        path: 'playground',
        HydrateFallback: PageLoading,
        // Lazy route: the catalog never downloads Monaco or the runner
        lazy: async () => ({ Component: (await import('@/features/playground')).PlaygroundPage }),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
