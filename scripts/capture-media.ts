/**
 * Captures the README media from the production build: screenshots of the catalog, a pattern and
 * the playground in both themes, plus a GIF of the helm picking a challenge and its tests passing.
 * Usage: pnpm build && pnpm media   (the GIF needs ffmpeg on the PATH)
 */
import { spawn, spawnSync, type ChildProcess } from 'node:child_process';
import { mkdir, mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium, type Browser, type BrowserContextOptions, type Page } from '@playwright/test';
import { challenges } from '../src/content/index.ts';

const PORT = 4174;
const BASE = `http://localhost:${PORT}/reef-patterns/`;
const OUT = join(import.meta.dirname, '..', 'docs', 'media');
const VIEWPORT = { width: 1280, height: 800 };
const THEMES = ['dark', 'light'] as const;

// Every challenge starts from its solution, so whichever one the helm picks ends all green
const seedSolutions = () =>
  Object.fromEntries(challenges.map((c) => [`reef-patterns:draft:${c.id}`, c.solution]));

const startPreview = async (): Promise<ChildProcess> => {
  const server = spawn(
    'pnpm',
    ['exec', 'vite', 'preview', '--port', String(PORT), '--strictPort'],
    {
      stdio: 'ignore',
    },
  );
  for (let i = 0; i < 50; i++) {
    try {
      if ((await fetch(BASE)).ok) return server;
    } catch {
      // not listening yet
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  server.kill();
  throw new Error('vite preview did not start: run `pnpm build` first');
};

const newPage = async (browser: Browser, options: BrowserContextOptions, drafts = {}) => {
  const context = await browser.newContext({ viewport: VIEWPORT, ...options });
  await context.addInitScript((entries: Record<string, string>) => {
    for (const [key, value] of Object.entries(entries)) localStorage.setItem(key, value);
    // Silent capture: no ship sounds
    localStorage.setItem('reef-patterns:sound', 'off');
  }, drafts);
  return { context, page: await context.newPage() };
};

/** Waits until React replaced the prerendered markup and fonts are ready. */
const open = async (page: Page, path: string) => {
  await page.goto(new URL(path, BASE).href);
  await page.locator('[data-prerender]').waitFor({ state: 'detached' });
  await page.evaluate(() => document.fonts.ready);
};

const runTests = async (page: Page) => {
  await page.locator('.monaco-editor').first().waitFor();
  await page.getByRole('button', { name: 'Run tests' }).click();
  await page.getByText(/All green!/).waitFor();
};

const screenshots = async (browser: Browser) => {
  for (const colorScheme of THEMES) {
    const { context, page } = await newPage(
      browser,
      { colorScheme, reducedMotion: 'reduce' },
      seedSolutions(),
    );
    await open(page, './');
    await page.screenshot({ path: join(OUT, `catalog-${colorScheme}.png`) });
    await open(page, './patterns/strategy/');
    await page.screenshot({ path: join(OUT, `pattern-${colorScheme}.png`) });
    await open(page, './playground?challenge=strategy-1');
    await runTests(page);
    await page.waitForTimeout(500);
    await page.screenshot({ path: join(OUT, `playground-${colorScheme}.png`) });
    await context.close();
    console.log(`✓ screenshots (${colorScheme})`);
  }
};

const helmGif = async (browser: Browser) => {
  if (spawnSync('ffmpeg', ['-version']).status !== 0) {
    console.warn('! ffmpeg not found: skipping helm.gif (brew install ffmpeg)');
    return;
  }
  const videoDir = await mkdtemp(join(tmpdir(), 'reef-media-'));
  const { context, page } = await newPage(
    browser,
    { colorScheme: 'dark', recordVideo: { dir: videoDir, size: VIEWPORT } },
    seedSolutions(),
  );
  await open(page, './playground');
  await page.waitForTimeout(800);
  // The helm sways, so it is never "stable" for a click: spin it from the keyboard
  await page.getByRole('button', { name: 'Spin the helm' }).focus();
  await page.keyboard.press('Enter');
  const start = page.getByRole('button', { name: 'Start challenge' });
  await start.waitFor();
  await page.waitForTimeout(1200);
  await start.click();
  await runTests(page);
  await page.waitForTimeout(2500);
  await context.close();

  const [video] = await readdir(videoDir);
  if (!video) throw new Error('no video recorded');
  // Two-pass palette keeps the GIF sharp and small
  const filters = 'fps=12,scale=900:-1:flags=lanczos';
  const ffmpeg = spawnSync(
    'ffmpeg',
    [
      '-y',
      '-loglevel',
      'error',
      '-i',
      join(videoDir, video),
      '-vf',
      `${filters},split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=4`,
      join(OUT, 'helm.gif'),
    ],
    { stdio: 'inherit' },
  );
  await rm(videoDir, { recursive: true, force: true });
  if (ffmpeg.status !== 0) throw new Error('ffmpeg failed');
  console.log('✓ helm.gif');
};

await mkdir(OUT, { recursive: true });
const server = await startPreview();
const browser = await chromium.launch();
try {
  await screenshots(browser);
  await helmGif(browser);
} finally {
  await browser.close();
  server.kill();
}
