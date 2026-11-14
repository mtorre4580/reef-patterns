import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { routes } from '@/app/routes';
import { ThemeProvider } from '@/app/ThemeProvider';

/** Renders the whole app at a route using an in-memory router. */
export function renderRoute(path = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  const user = userEvent.setup();
  const utils = render(
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>,
  );
  return { ...utils, user, router };
}
