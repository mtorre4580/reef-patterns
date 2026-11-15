import { createBrowserRouter, RouterProvider } from 'react-router';
import { routes } from './routes';
import { I18nProvider } from '@/i18n';
import { SoundProvider } from './SoundProvider';
import { ThemeProvider } from './ThemeProvider';

// Real URLs so search engines can index every page. GitHub Pages has no SPA fallback: the build
// prerenders one HTML file per route (scripts/prerender.ts) and copies the shell to 404.html.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';
const router = createBrowserRouter(routes, { basename });

export const App = () => {
  return (
    <I18nProvider>
      <ThemeProvider>
        <SoundProvider>
          <RouterProvider router={router} />
        </SoundProvider>
      </ThemeProvider>
    </I18nProvider>
  );
};
