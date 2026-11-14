/**
 * Verifica el contenido: ids, rank, related, que cada ejemplo parsee y, para cada challenge,
 * que la solución pase todos los tests y que el starter falle al menos uno.
 * Uso: pnpm validate:content
 */
import { challenges, patterns } from '../src/content/index.ts';
import { validateChallengeShapes, validatePatterns } from '../src/content/validate.ts';

const issues = [
  ...validatePatterns(patterns),
  ...validateChallengeShapes(challenges, new Set(patterns.map((p) => p.id))),
];

if (issues.length > 0) {
  console.error(`✗ ${issues.length} problema(s) en el contenido:\n`);
  for (const issue of issues) console.error(`  ${issue.where}: ${issue.message}`);
  process.exit(1);
}

console.log(`✓ ${patterns.length} patrones y ${challenges.length} challenges válidos`);
