import { createHashRouter, RouterProvider } from 'react-router';
import { routes } from './routes';
import { I18nProvider } from '@/i18n';
import { ThemeProvider } from './ThemeProvider';

// Hash routing: GitHub Pages serves static files and has no SPA fallback
const router = createHashRouter(routes);

export const App = () => {
  return (
    <I18nProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </I18nProvider>
  );
};
