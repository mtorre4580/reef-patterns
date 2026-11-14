export type CategoryId =
  'creacional' | 'estructural' | 'comportamiento' | 'arquitectura' | 'resiliencia' | 'frontend';

/** 1 Esencial … 4 Poco común */
export type Tier = 1 | 2 | 3 | 4;

export interface PatternExample {
  title: string;
  scenario: string;
  /** JavaScript ES2023, sin dependencias ni APIs del DOM. */
  code: string;
}

export interface Pattern {
  /** kebab-case, estable: se usa en URLs */
  id: string;
  /** orden global 1..N, sin huecos */
  rank: number;
  /** nombre canónico en inglés */
  name: string;
  nameEs: string;
  category: CategoryId;
  tier: Tier;
  gof: boolean;
  /** una oración */
  summary: string;
  when: string;
  pros: string[];
  cons: string[];
  realWorld: string;
  example: PatternExample;
  related: string[];
}

export type Difficulty = 'facil' | 'media' | 'dificil';

export type AstCheck =
  | { rule: 'forbidNode'; node: string; message: string }
  | { rule: 'requireClass'; name: string; message: string }
  | { rule: 'requireMethod'; className: string; method: string; message: string }
  | { rule: 'maxIfStatements'; max: number; message: string };

export interface ChallengeTest {
  name: string;
  code: string;
}

export interface Challenge {
  /** `${patternId}-${n}` */
  id: string;
  patternId: string;
  title: string;
  difficulty: Difficulty;
  story: string;
  instructions: string;
  starterCode: string;
  tests: ChallengeTest[];
  checks?: AstCheck[];
  hints: string[];
  solution: string;
}
