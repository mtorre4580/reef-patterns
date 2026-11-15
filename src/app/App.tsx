import { createHashRouter, RouterProvider } from 'react-router';
import { routes } from './routes';
import { I18nProvider } from '@/i18n';
import { SoundProvider } from './SoundProvider';
import { ThemeProvider } from './ThemeProvider';

// Hash routing: GitHub Pages serves static files and has no SPA fallback
const router = createHashRouter(routes);

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
