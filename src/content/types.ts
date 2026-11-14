import type { Locale } from '@/i18n/locales';

export type CategoryId =
  'creacional' | 'estructural' | 'comportamiento' | 'arquitectura' | 'resiliencia' | 'frontend';

/** 1 Essential … 4 Rare */
export type Tier = 1 | 2 | 3 | 4;

/** A value in every supported language. */
export type Localized<T> = Record<Locale, T>;

export interface PatternExample {
  title: Localized<string>;
  scenario: Localized<string>;
  /** JavaScript ES2023, no dependencies, no DOM APIs. Comments and strings in English. */
  code: string;
}

export interface Pattern {
  /** kebab-case, stable: used in URLs */
  id: string;
  /** global order 1..N, no gaps */
  rank: number;
  /** canonical English name */
  name: string;
  /** name as it is usually said in each language */
  localName: Localized<string>;
  category: CategoryId;
  tier: Tier;
  gof: boolean;
  /** one sentence */
  summary: Localized<string>;
  when: Localized<string>;
  pros: Localized<string[]>;
  cons: Localized<string[]>;
  realWorld: Localized<string>;
  example: PatternExample;
  related: string[];
}

export type Difficulty = 'facil' | 'media' | 'dificil';

/** Static rule run on the user code. `M` is the message type (localized in content). */
export type AstCheck<M = string> =
  | { rule: 'forbidNode'; node: string; message: M }
  | { rule: 'requireClass'; name: string; message: M }
  | { rule: 'requireMethod'; className: string; method: string; message: M }
  | { rule: 'maxIfStatements'; max: number; message: M };

export interface ChallengeTest {
  name: string;
  code: string;
}

export interface LocalizedChallengeTest {
  name: Localized<string>;
  code: string;
}

export interface Challenge {
  /** `${patternId}-${n}` */
  id: string;
  patternId: string;
  title: Localized<string>;
  difficulty: Difficulty;
  story: Localized<string>;
  /** What to implement, with exact API names. Supports `code` and “- ” lists. */
  instructions: Localized<string>;
  /** JS. Comments and strings in English. */
  starterCode: string;
  tests: LocalizedChallengeTest[];
  checks?: AstCheck<Localized<string>>[];
  hints: Localized<string[]>;
  solution: string;
}
