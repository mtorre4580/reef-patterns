import { useCallback, useEffect, useRef, useState } from 'react';
import type { Challenge } from '@/content/types';
import { storage } from '@/lib/storage';

export const draftKey = (challengeId: string) => `reef-patterns:draft:${challengeId}`;

/** Challenge code with a draft autosaved to localStorage. */
export function useDraft(challenge: Challenge | undefined, delayMs = 400) {
  const [code, setCode] = useState(() =>
    challenge ? (storage.get(draftKey(challenge.id)) ?? challenge.starterCode) : '',
  );
  const [loadedId, setLoadedId] = useState(challenge?.id);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Challenge changed: load its draft (state adjustment during render)
  if (challenge?.id !== loadedId) {
    setLoadedId(challenge?.id);
    setCode(challenge ? (storage.get(draftKey(challenge.id)) ?? challenge.starterCode) : '');
  }

  useEffect(() => () => clearTimeout(timer.current), []);

  const update = useCallback(
    (next: string) => {
      setCode(next);
      if (!challenge) return;
      clearTimeout(timer.current);
      timer.current = setTimeout(() => storage.set(draftKey(challenge.id), next), delayMs);
    },
    [challenge, delayMs],
  );

  const reset = useCallback(() => {
    if (!challenge) return;
    clearTimeout(timer.current);
    storage.remove(draftKey(challenge.id));
    setCode(challenge.starterCode);
  }, [challenge]);

  return { code, setCode: update, reset };
}
