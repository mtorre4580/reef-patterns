import type { Locale } from './locales';

export interface Plural {
  one: string;
  other: string;
}

type Primitive = string | number;
export type Params = Record<string, Primitive>;

/** Dot paths to every translatable leaf (a string or a plural pair). */
export type MessageKey<T, Prefix extends string = ''> = {
  [K in keyof T & (string | number)]: T[K] extends string | Plural
    ? `${Prefix}${K}`
    : MessageKey<T[K], `${Prefix}${K}.`>;
}[keyof T & (string | number)];

const isPlural = (value: unknown): value is Plural =>
  typeof value === 'object' && value !== null && 'one' in value && 'other' in value;

export const lookup = (messages: object, key: string): unknown =>
  key
    .split('.')
    .reduce<unknown>(
      (node, part) =>
        node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined,
      messages,
    );

export const interpolate = (template: string, params: Params = {}): string =>
  template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );

/** Resolves a key, picks the plural form with Intl.PluralRules and fills {placeholders}. */
export const translate = (
  messages: object,
  locale: Locale,
  key: string,
  params?: Params,
): string => {
  const value = lookup(messages, key);
  if (typeof value === 'string') return interpolate(value, params);
  if (isPlural(value)) {
    const count = Number(params?.count ?? 0);
    const form = new Intl.PluralRules(locale).select(count) === 'one' ? value.one : value.other;
    return interpolate(form, params);
  }
  return key;
};
