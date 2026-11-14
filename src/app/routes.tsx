import type { RouteObject } from 'react-router';
import { CatalogPage, PatternDetailPage } from '@/features/catalog';
import { Layout } from './Layout';
import { NotFoundPage } from './NotFoundPage';
import { PlaygroundPlaceholder } from './PlaygroundPlaceholder';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <CatalogPage /> },
      { path: 'patterns/:id', element: <PatternDetailPage /> },
      { path: 'playground', element: <PlaygroundPlaceholder /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
