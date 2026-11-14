import { useEffect } from 'react';

const BASE = 'Reef Patterns';

/** Updates the tab title: “Strategy · Reef Patterns”. */
export function useDocumentTitle(title: string | null) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE}` : BASE;
  }, [title]);
}
