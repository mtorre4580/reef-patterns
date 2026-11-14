import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { storage } from '@/lib/storage';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'reef-patterns:theme';

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

type Action = { type: 'toggle' } | { type: 'set'; theme: Theme };

function reducer(state: Theme, action: Action): Theme {
  if (action.type === 'set') return action.theme;
  return state === 'dark' ? 'light' : 'dark';
}

function initialTheme(): Theme {
  const fromDom = document.documentElement.dataset.theme;
  return fromDom === 'light' ? 'light' : 'dark';
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, dispatch] = useReducer(reducer, undefined, initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    storage.set(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, toggle: () => dispatch({ type: 'toggle' }) }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>');
  return ctx;
}
