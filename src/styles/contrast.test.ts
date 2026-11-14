import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const css = readFileSync(resolve(__dirname, 'theme.css'), 'utf8');

function block(selector: string): Record<string, string> {
  const start = css.indexOf(selector);
  const body = css.slice(css.indexOf('{', start) + 1, css.indexOf('\n}', start));
  return Object.fromEntries(
    [...body.matchAll(/--color-([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1]!, m[2]!]),
  );
}

const dark = block('@theme {');
const light = { ...dark, ...block(":root[data-theme='light'] {") };

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

function ratio(a: string, b: string): number {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1! + 0.05) / (l2! + 0.05);
}

// [text, background, minimum]
const pairs: [string, string, number][] = [
  ['foam', 'abyss', 7],
  ['foam', 'trench', 7],
  ['kelp', 'abyss', 4.5],
  ['kelp', 'trench', 4.5],
  ['kelp', 'reef', 4.5],
  ['lagoon', 'abyss', 4.5],
  ['lagoon-ink', 'lagoon', 4.5],
  ['coral', 'trench', 4.5],
  ['anemone', 'trench', 4.5],
  ['biolum', 'abyss', 3],
  ['cat-creacional', 'abyss', 3],
  ['cat-frontend', 'abyss', 3],
];

describe.each([
  ['dark', dark],
  ['light', light],
])('contraste WCAG AA en modo %s', (_name, theme) => {
  it.each(pairs)('%s on %s ≥ %d:1', (fg, bg, min) => {
    expect(theme[fg], fg).toBeDefined();
    expect(ratio(theme[fg]!, theme[bg]!)).toBeGreaterThanOrEqual(min);
  });
});
