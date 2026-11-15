import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const read = (): boolean => {
  try {
    return window.matchMedia(QUERY).matches;
  } catch {
    return false;
  }
};

/**
 * Live `prefers-reduced-motion` flag. Motion's own hook caches the preference globally the first
 * time it is read, which goes stale when the setting changes; this one listens for changes.
 */
export const usePrefersReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(read);
  useEffect(() => {
    let mql: MediaQueryList;
    try {
      mql = window.matchMedia(QUERY);
    } catch {
      return;
    }
    const onChange = () => setReduced(mql.matches);
    mql.addEventListener?.('change', onChange);
    return () => mql.removeEventListener?.('change', onChange);
  }, []);
  return reduced;
};
