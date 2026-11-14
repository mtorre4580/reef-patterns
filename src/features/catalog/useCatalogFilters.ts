import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { parseFilters, serializeFilters, type CatalogFilters } from './filters';

/** Filtros del catálogo sincronizados con la URL. */
export function useCatalogFilters() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => parseFilters(params), [params]);

  const update = useCallback(
    (patch: Partial<CatalogFilters>) => {
      setParams((prev) => serializeFilters({ ...parseFilters(prev), ...patch }, prev), {
        replace: true,
        preventScrollReset: true,
      });
    },
    [setParams],
  );

  return { filters, update };
}
