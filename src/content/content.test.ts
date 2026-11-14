import { challenges, challengesByPattern, patterns, patternsById, tiers } from './index';
import { executeChallenge } from '@/lib/runner/execute';
import { validateChallengeRuns, validateChallengeShapes, validatePatterns } from './validate';

describe('content', () => {
  it('has 52 valid patterns', () => {
    expect(patterns).toHaveLength(52);
    expect(validatePatterns(patterns)).toEqual([]);
  });

  it('covers the four tiers, with 11 essential and 29 in tiers 1–2', () => {
    for (const { tier } of tiers) {
      expect(patterns.some((p) => p.tier === tier)).toBe(true);
    }
    expect(patterns.filter((p) => p.tier === 1)).toHaveLength(11);
    expect(patterns.filter((p) => p.tier <= 2)).toHaveLength(29);
  });

  it('indexes by id', () => {
    expect(patternsById.get('strategy')?.name).toBe('Strategy');
  });

  it('groups challenges by pattern', () => {
    expect(validateChallengeShapes(challenges, new Set(patternsById.keys()))).toEqual([]);
    const total = [...challengesByPattern.values()].reduce((n, list) => n + list.length, 0);
    expect(total).toBe(challenges.length);
  });

  it('every solution passes and every starter fails', async () => {
    expect(await validateChallengeRuns(challenges, executeChallenge)).toEqual([]);
  });

  it('detects problems in invalid content', () => {
    const broken = {
      ...patterns[0]!,
      rank: 3,
      related: ['no-such-id'],
      summary: { ...patterns[0]!.summary, 'pt-BR': '' },
    };
    broken.example = { ...broken.example, code: 'const = ;' };
    const messages = validatePatterns([broken]).map((i) => i.message);
    expect(messages.some((m) => m.includes('rank'))).toBe(true);
    expect(messages.some((m) => m.includes('no-such-id'))).toBe(true);
    expect(messages.some((m) => m.includes('does not parse'))).toBe(true);
    expect(messages).toContain('summary is missing in pt-BR');
  });
});
