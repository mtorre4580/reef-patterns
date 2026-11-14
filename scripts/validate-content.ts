/**
 * Validates content: ids, rank, related, that every example parses and, for each challenge,
 * that the solution passes every test and the starter fails at least one.
 * Usage: pnpm validate:content
 */
import { challenges, patterns } from '../src/content/index.ts';
import {
  validateChallengeRuns,
  validateChallengeShapes,
  validatePatterns,
} from '../src/content/validate.ts';
import { executeChallenge } from '../src/lib/runner/execute.ts';

const issues = [
  ...validatePatterns(patterns),
  ...validateChallengeShapes(challenges, new Set(patterns.map((p) => p.id))),
  ...(await validateChallengeRuns(challenges, executeChallenge)),
];

if (issues.length > 0) {
  console.error(`✗ ${issues.length} content issue(s):\n`);
  for (const issue of issues) console.error(`  ${issue.where}: ${issue.message}`);
  process.exit(1);
}

console.log(`✓ ${patterns.length} patterns and ${challenges.length} challenges are valid`);
