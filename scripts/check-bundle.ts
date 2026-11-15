/**
 * Fails if the production build goes over the gzip limits in bundle-budget.json.
 * Usage: pnpm build && pnpm check:bundle
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { checkBudget, type Asset, type Budget } from './bundle-budget.ts';

const DIST = 'dist';
const ASSETS = join(DIST, 'assets');

const budget = JSON.parse(readFileSync('bundle-budget.json', 'utf8')) as Budget;

let html: string;
try {
  html = readFileSync(join(DIST, 'index.html'), 'utf8');
} catch {
  console.error('dist/index.html not found: run `pnpm build` first.');
  process.exit(1);
}

const assets: Asset[] = readdirSync(ASSETS)
  .filter((file) => file.endsWith('.js') || file.endsWith('.css'))
  .map((file) => ({
    file,
    gzipBytes: gzipSync(readFileSync(join(ASSETS, file)), { level: 9 }).length,
    initial: html.includes(`assets/${file}`),
  }));

const rows = checkBudget(assets, budget).sort((a, b) => b.kb - a.kb);
const failed = rows.filter((r) => !r.ok);

console.table(
  rows.map((r) => ({
    chunk: r.label,
    'gzip KB': r.kb,
    'limit KB': r.limitKb,
    status: r.ok ? 'ok' : 'OVER',
  })),
);

if (failed.length > 0) {
  console.error(`\n${failed.length} chunk(s) over budget:`);
  for (const r of failed) console.error(`  ${r.label}: ${r.kb} KB > ${r.limitKb} KB`);
  process.exit(1);
}
console.log('\nBundle within budget.');
