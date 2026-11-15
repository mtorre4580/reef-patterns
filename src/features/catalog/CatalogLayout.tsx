import { ViewTransition } from 'react';
import { Outlet } from 'react-router';

// Persistent boundary for the catalog and detail routes. React Router runs navigations inside
// startTransition, so React cross-fades the outlet when it moves between catalog pages. Entering
// or leaving the catalog (e.g. to the playground) does not animate, as before.
export const CatalogLayout = () => {
  return (
    <ViewTransition default="none" update="catalog-page">
      <div>
        <Outlet />
      </div>
    </ViewTransition>
  );
};
