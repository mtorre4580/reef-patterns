import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { storage } from '@/lib/storage';
import { parseProgress, PROGRESS_KEY, progressReducer } from './progress';

interface ProgressContextValue {
  completed: ReadonlySet<string>;
  markCompleted: (challengeId: string) => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(progressReducer, undefined, () =>
    parseProgress(storage.getJson(PROGRESS_KEY, null)),
  );

  useEffect(() => {
    storage.setJson(PROGRESS_KEY, state);
  }, [state]);

  const value = useMemo<ProgressContextValue>(
    () => ({
      completed: new Set(state.completed),
      markCompleted: (challengeId) => dispatch({ type: 'complete', challengeId }),
      reset: () => dispatch({ type: 'reset' }),
    }),
    [state],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress debe usarse dentro de <ProgressProvider>');
  return ctx;
}
