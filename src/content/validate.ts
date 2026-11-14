import { parse } from 'acorn';
import type { Challenge, Pattern } from './types';
import { categoriesById } from './categories';

export interface ValidationIssue {
  where: string;
  message: string;
}

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function parsesAsJs(code: string): string | null {
  try {
    parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}

/** Validaciones estáticas del contenido (sin ejecutar challenges). */
export function validatePatterns(patterns: Pattern[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const ids = new Set<string>();

  for (const p of patterns) {
    const where = `pattern:${p.id}`;
    if (ids.has(p.id)) issues.push({ where, message: 'id duplicado' });
    ids.add(p.id);
    if (!KEBAB.test(p.id)) issues.push({ where, message: 'el id debe ser kebab-case' });
    if (!categoriesById.has(p.category))
      issues.push({ where, message: `categoría desconocida: ${p.category}` });
    if (![1, 2, 3, 4].includes(p.tier)) issues.push({ where, message: `tier inválido: ${p.tier}` });
    for (const field of ['name', 'nameEs', 'summary', 'when', 'realWorld'] as const) {
      if (!p[field]?.trim()) issues.push({ where, message: `falta ${field}` });
    }
    if (p.pros.length < 2 || p.pros.length > 4)
      issues.push({ where, message: 'pros debe tener entre 2 y 4 ítems' });
    if (p.cons.length < 2 || p.cons.length > 4)
      issues.push({ where, message: 'cons debe tener entre 2 y 4 ítems' });
    if (!p.example.title || !p.example.scenario)
      issues.push({ where, message: 'el ejemplo necesita título y escenario' });
    const parseError = parsesAsJs(p.example.code);
    if (parseError) issues.push({ where, message: `example.code no parsea: ${parseError}` });
  }

  const sorted = [...patterns].sort((a, b) => a.rank - b.rank);
  sorted.forEach((p, i) => {
    if (p.rank !== i + 1)
      issues.push({ where: `pattern:${p.id}`, message: `rank ${p.rank}, se esperaba ${i + 1}` });
  });
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1]!;
    const cur = sorted[i]!;
    if (cur.tier < prev.tier)
      issues.push({
        where: `pattern:${cur.id}`,
        message: 'los tiers deben ser no decrecientes según el rank',
      });
  }

  for (const p of patterns) {
    for (const rel of p.related) {
      if (rel === p.id)
        issues.push({ where: `pattern:${p.id}`, message: 'related no puede incluirse a sí mismo' });
      else if (!ids.has(rel))
        issues.push({
          where: `pattern:${p.id}`,
          message: `related apunta a un id inexistente: ${rel}`,
        });
    }
  }
  return issues;
}

export function validateChallengeShapes(
  challenges: Challenge[],
  patternIds: ReadonlySet<string>,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const ids = new Set<string>();
  for (const c of challenges) {
    const where = `challenge:${c.id}`;
    if (ids.has(c.id)) issues.push({ where, message: 'id duplicado' });
    ids.add(c.id);
    if (!patternIds.has(c.patternId))
      issues.push({ where, message: `patternId inexistente: ${c.patternId}` });
    if (!new RegExp(`^${c.patternId}-\\d+$`).test(c.id))
      issues.push({ where, message: 'el id debe ser `${patternId}-${n}`' });
    if (c.tests.length === 0) issues.push({ where, message: 'necesita al menos un test' });
    if (c.hints.length === 0) issues.push({ where, message: 'necesita al menos una pista' });
    for (const [label, code] of [
      ['starterCode', c.starterCode],
      ['solution', c.solution],
    ] as const) {
      const err = parsesAsJs(code);
      if (err) issues.push({ where, message: `${label} no parsea: ${err}` });
    }
  }
  return issues;
}
