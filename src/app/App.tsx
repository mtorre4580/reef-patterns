import { createHashRouter, RouterProvider } from 'react-router';
import { routes } from './routes';
import { ThemeProvider } from './ThemeProvider';

// Hash routing: GitHub Pages serves static files and has no SPA fallback
const router = createHashRouter(routes);

export const App = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};
