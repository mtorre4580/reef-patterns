import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { routes } from '@/app/routes';
import { SoundProvider } from '@/app/SoundProvider';
import { ThemeProvider } from '@/app/ThemeProvider';
import { I18nProvider, type Locale } from '@/i18n';

/** Renders the whole app at a route using an in-memory router. */
export function renderRoute(path = '/', locale: Locale = 'en') {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  const user = userEvent.setup();
  const utils = render(
    <I18nProvider initial={locale}>
      <ThemeProvider>
        <SoundProvider>
          <RouterProvider router={router} />
        </SoundProvider>
      </ThemeProvider>
    </I18nProvider>,
  );
  return { ...utils, user, router };
}
