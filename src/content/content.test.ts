import { challenges, challengesByPattern, patterns, patternsById, tiers } from './index';
import { validateChallengeShapes, validatePatterns } from './validate';

describe('contenido', () => {
  it('tiene 52 patrones válidos', () => {
    expect(patterns).toHaveLength(52);
    expect(validatePatterns(patterns)).toEqual([]);
  });

  it('cubre los cuatro tiers, con 11 esenciales y 29 en tiers 1–2', () => {
    for (const { tier } of tiers) {
      expect(patterns.some((p) => p.tier === tier)).toBe(true);
    }
    expect(patterns.filter((p) => p.tier === 1)).toHaveLength(11);
    expect(patterns.filter((p) => p.tier <= 2)).toHaveLength(29);
  });

  it('indexa por id', () => {
    expect(patternsById.get('strategy')?.name).toBe('Strategy');
  });

  it('agrupa los challenges por patrón', () => {
    expect(validateChallengeShapes(challenges, new Set(patternsById.keys()))).toEqual([]);
    const total = [...challengesByPattern.values()].reduce((n, list) => n + list.length, 0);
    expect(total).toBe(challenges.length);
  });

  it('detecta problemas en contenido inválido', () => {
    const broken = { ...patterns[0]!, rank: 3, related: ['no-existe'] };
    broken.example = { ...broken.example, code: 'const = ;' };
    const messages = validatePatterns([broken]).map((i) => i.message);
    expect(messages.some((m) => m.includes('rank'))).toBe(true);
    expect(messages.some((m) => m.includes('no-existe'))).toBe(true);
    expect(messages.some((m) => m.includes('no parsea'))).toBe(true);
  });
});
