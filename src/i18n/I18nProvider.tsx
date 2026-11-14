import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import { storage } from '@/lib/storage';
import { DEFAULT_LOCALE, isLocale, LOCALE_STORAGE_KEY, type Locale } from './locales';
import { messages, type Messages } from './messages';
import { translate, type MessageKey, type Params } from './translate';

export type TranslationKey = MessageKey<Messages>;

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: Params) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

type Action = { type: 'set'; locale: Locale };

const reducer = (_state: Locale, action: Action): Locale => action.locale;

const initialLocale = (): Locale => {
  const stored = storage.get(LOCALE_STORAGE_KEY);
  return isLocale(stored) ? stored : DEFAULT_LOCALE;
};

interface I18nProviderProps {
  children: ReactNode;
  /** Forces a starting locale (tests); otherwise the stored choice or English */
  initial?: Locale;
}

export const I18nProvider = ({ children, initial }: I18nProviderProps) => {
  const [locale, dispatch] = useReducer(reducer, initial, (forced) => forced ?? initialLocale());

  useEffect(() => {
    document.documentElement.lang = locale;
    storage.set(LOCALE_STORAGE_KEY, locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => dispatch({ type: 'set', locale: next }), []);
  const t = useCallback(
    (key: TranslationKey, params?: Params) => translate(messages[locale], locale, key, params),
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
};
