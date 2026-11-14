import type { Locale } from '../locales';
import type { Plural } from '../translate';
import { en } from './en';
import { es } from './es';
import { ptBR } from './pt-BR';

type Widen<T> = T extends string
  ? string
  : T extends Plural
    ? Plural
    : { [K in keyof T]: Widen<T[K]> };

/** Every locale must provide exactly the keys of the English source. */
export type Messages = Widen<typeof en>;

export const messages: Record<Locale, Messages> = { en, es, 'pt-BR': ptBR };
