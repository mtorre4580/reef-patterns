export type Locale = 'en' | 'es' | 'pt-BR';

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_STORAGE_KEY = 'reef-patterns:locale';

export interface LocaleInfo {
  id: Locale;
  /** Name of the language in that language */
  label: string;
  /** Short code shown in the header */
  short: string;
}

export const locales: LocaleInfo[] = [
  { id: 'en', label: 'English (US)', short: 'EN' },
  { id: 'es', label: 'Español', short: 'ES' },
  { id: 'pt-BR', label: 'Português (Brasil)', short: 'PT' },
];

export const isLocale = (value: unknown): value is Locale => locales.some((l) => l.id === value);
