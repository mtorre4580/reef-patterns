import { parse } from 'acorn';
import { locales } from '@/i18n/locales';
import type { AstCheck, Challenge, ChallengeTest, Localized, Pattern } from './types';
import { categoriesById } from './categories';
import { runnableChallenge } from './localize';

export interface ValidationIssue {
  where: string;
  message: string;
}

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LOCALES = locales.map((l) => l.id);

export const parsesAsJs = (code: string): string | null => {
  try {
    parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
};

/** Every locale present and non-empty. */
const checkText = (value: Localized<string>, field: string, where: string): ValidationIssue[] =>
  LOCALES.filter((l) => !value?.[l]?.trim()).map((l) => ({
    where,
    message: `${field} is missing in ${l}`,
  }));

/** Every locale present, non-empty items, same length across locales and within [min, max]. */
const checkList = (
  value: Localized<string[]>,
  field: string,
  where: string,
  [min, max]: [number, number],
): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  const lengths = new Set(LOCALES.map((l) => value?.[l]?.length ?? 0));
  if (lengths.size > 1)
    issues.push({ where, message: `${field} has different lengths per locale` });
  for (const l of LOCALES) {
    const list = value?.[l] ?? [];
    if (list.length < min || list.length > max)
      issues.push({ where, message: `${field} (${l}) must have between ${min} and ${max} items` });
    if (list.some((item) => !item.trim()))
      issues.push({ where, message: `${field} (${l}) has empty items` });
  }
  return issues;
};

/** Static content checks (without running challenges). */
export const validatePatterns = (patterns: Pattern[]): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  const ids = new Set<string>();

  for (const p of patterns) {
    const where = `pattern:${p.id}`;
    if (ids.has(p.id)) issues.push({ where, message: 'duplicate id' });
    ids.add(p.id);
    if (!KEBAB.test(p.id)) issues.push({ where, message: 'the id must be kebab-case' });
    if (!categoriesById.has(p.category))
      issues.push({ where, message: `unknown category: ${p.category}` });
    if (![1, 2, 3, 4].includes(p.tier)) issues.push({ where, message: `invalid tier: ${p.tier}` });
    if (!p.name?.trim()) issues.push({ where, message: 'name is missing' });
    issues.push(...checkText(p.localName, 'localName', where));
    issues.push(...checkText(p.summary, 'summary', where));
    issues.push(...checkText(p.when, 'when', where));
    issues.push(...checkText(p.realWorld, 'realWorld', where));
    issues.push(...checkText(p.example.title, 'example.title', where));
    issues.push(...checkText(p.example.scenario, 'example.scenario', where));
    issues.push(...checkList(p.pros, 'pros', where, [2, 4]));
    issues.push(...checkList(p.cons, 'cons', where, [2, 4]));
    const parseError = parsesAsJs(p.example.code);
    if (parseError) issues.push({ where, message: `example.code does not parse: ${parseError}` });
  }

  const sorted = [...patterns].sort((a, b) => a.rank - b.rank);
  sorted.forEach((p, i) => {
    if (p.rank !== i + 1)
      issues.push({ where: `pattern:${p.id}`, message: `rank ${p.rank}, expected ${i + 1}` });
  });
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1]!;
    const cur = sorted[i]!;
    if (cur.tier < prev.tier)
      issues.push({ where: `pattern:${cur.id}`, message: 'tiers must not decrease with rank' });
  }

  for (const p of patterns) {
    for (const rel of p.related) {
      if (rel === p.id)
        issues.push({ where: `pattern:${p.id}`, message: 'related cannot include itself' });
      else if (!ids.has(rel))
        issues.push({
          where: `pattern:${p.id}`,
          message: `related points to a missing id: ${rel}`,
        });
    }
  }
  return issues;
};

export const validateChallengeShapes = (
  challenges: Challenge[],
  patternIds: ReadonlySet<string>,
): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  const ids = new Set<string>();
  for (const c of challenges) {
    const where = `challenge:${c.id}`;
    if (ids.has(c.id)) issues.push({ where, message: 'duplicate id' });
    ids.add(c.id);
    if (!patternIds.has(c.patternId))
      issues.push({ where, message: `unknown patternId: ${c.patternId}` });
    if (!new RegExp(`^${c.patternId}-\\d+$`).test(c.id))
      issues.push({ where, message: 'the id must be `${patternId}-${n}`' });
    issues.push(...checkText(c.title, 'title', where));
    issues.push(...checkText(c.story, 'story', where));
    issues.push(...checkText(c.instructions, 'instructions', where));
    issues.push(...checkList(c.hints, 'hints', where, [1, 6]));
    if (c.tests.length === 0) issues.push({ where, message: 'needs at least one test' });
    c.tests.forEach((t, i) => issues.push(...checkText(t.name, `tests[${i}].name`, where)));
    (c.checks ?? []).forEach((check, i) =>
      issues.push(...checkText(check.message, `checks[${i}].message`, where)),
    );
    for (const [label, code] of [
      ['starterCode', c.starterCode],
      ['solution', c.solution],
    ] as const) {
      const err = parsesAsJs(code);
      if (err) issues.push({ where, message: `${label} does not parse: ${err}` });
    }
  }
  return issues;
};

type Execute = (request: {
  code: string;
  tests: ChallengeTest[];
  checks?: AstCheck[];
}) => Promise<{ results: { name: string; passed: boolean; error?: string }[] }>;

/**
 * Runs every challenge: the solution must pass all tests and checks, and the starter must
 * fail at least one (otherwise the challenge asks for nothing).
 */
export const validateChallengeRuns = async (
  challenges: Challenge[],
  execute: Execute,
): Promise<ValidationIssue[]> => {
  const issues: ValidationIssue[] = [];
  for (const c of challenges) {
    const where = `challenge:${c.id}`;
    const runnable = runnableChallenge(c, 'en');
    const solution = await execute({ code: c.solution, ...runnable });
    for (const r of solution.results.filter((r) => !r.passed)) {
      issues.push({ where, message: `the solution fails "${r.name}": ${r.error ?? ''}` });
    }
    const starter = await execute({ code: c.starterCode, ...runnable });
    if (starter.results.every((r) => r.passed)) {
      issues.push({ where, message: 'the starterCode passes every test' });
    }
  }
  return issues;
};
