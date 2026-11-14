import { useEffect } from 'react';

const BASE = 'Reef Patterns';

/** Actualiza el título de la pestaña: “Strategy · Reef Patterns”. */
export function useDocumentTitle(title: string | null) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE}` : BASE;
  }, [title]);
}
