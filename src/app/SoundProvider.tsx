import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { playBell, playCreak, playTick } from '@/lib/sound';
import { storage } from '@/lib/storage';

const STORAGE_KEY = 'reef-patterns:sound';

interface SoundContextValue {
  enabled: boolean;
  toggle: () => void;
  tick: (strength?: number) => void;
  creak: () => void;
  bell: (strikes?: number) => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

type Action = { type: 'toggle' };

const reducer = (state: boolean, _action: Action): boolean => !state;

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  // Sound is on unless the user muted it before
  const [enabled, dispatch] = useReducer(
    reducer,
    undefined,
    () => storage.get(STORAGE_KEY) !== 'off',
  );

  useEffect(() => {
    storage.set(STORAGE_KEY, enabled ? 'on' : 'off');
  }, [enabled]);

  const value = useMemo<SoundContextValue>(
    () => ({
      enabled,
      toggle: () => dispatch({ type: 'toggle' }),
      tick: (strength) => enabled && playTick(strength),
      creak: () => enabled && playCreak(),
      bell: (strikes) => enabled && playBell(strikes),
    }),
    [enabled],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
};

export const useSound = (): SoundContextValue => {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error('useSound must be used inside <SoundProvider>');
  return ctx;
};
