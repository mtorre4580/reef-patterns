/**
 * Writes one static HTML file per route into dist/ so GitHub Pages serves real URLs and search
 * engines see each page's title, description, JSON-LD and content without running JavaScript.
 * Also writes 404.html (SPA fallback for any other path) and sitemap.xml.
 * Usage: runs after `vite build` (see the `build` script).
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { patterns, patternsById } from '../src/content/index.ts';
import { en } from '../src/i18n/messages/en.ts';
import {
  buildSitemap,
  patternPath,
  renderHomePage,
  renderPatternPage,
  renderPlaygroundPage,
} from './prerender-lib.ts';

const DIST = join(import.meta.dirname, '..', 'dist');

const write = async (path: string, html: string) => {
  const file = join(DIST, path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
};

// `vite build` empties dist/, so a 404.html here is the shell saved by an earlier run of this
// script on the same build: reuse it so running twice does not prerender an already filled page
const template = await readFile(join(DIST, '404.html'), 'utf8').catch(() =>
  readFile(join(DIST, 'index.html'), 'utf8'),
);
const labels = { categories: en.categories, tiers: en.tiers };

// The untouched shell: any path without its own file falls back to it
await write('404.html', template);
await write('index.html', renderHomePage(template, patterns, labels));
await write('playground/index.html', renderPlaygroundPage(template));
for (const p of patterns) {
  await write(
    `${patternPath(p.id)}index.html`,
    renderPatternPage(template, p, patternsById, labels),
  );
}

const paths = ['', 'playground/', ...patterns.map((p) => patternPath(p.id))];
await write('sitemap.xml', buildSitemap(paths, new Date().toISOString().slice(0, 10)));

console.log(`✓ prerendered ${paths.length} pages, 404.html and sitemap.xml`);
