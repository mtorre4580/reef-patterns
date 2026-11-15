import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

// Real browser: unlike the jsdom suite, color-contrast is checked here, in both themes
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const views: { name: string; path: string; disableRules?: string[] }[] = [
  { name: 'catalog', path: './' },
  { name: 'pattern detail', path: './#/patterns/strategy' },
  {
    name: 'helm',
    path: './#/playground',
    // The wheel draws pattern names on its sectors inside an aria-hidden SVG. They decorate the
    // control, they are not its label, so "Spin the helm" cannot contain them.
    disableRules: ['label-content-name-mismatch'],
  },
  { name: 'playground', path: './#/playground?challenge=observer-1' },
  { name: '404', path: './#/no-such-page' },
];

async function audit(page: Page, disableRules: string[] = []) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .disableRules(disableRules)
    // Monaco renders its own internal DOM; its accessibility is Monaco's responsibility
    .exclude('.monaco-editor')
    .analyze();
  return violations.map(
    (v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
  );
}

test.beforeEach(async ({ page }) => {
  // Static audits: no decorative motion mid-check
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

for (const view of views) {
  test(`${view.name} has no WCAG 2.2 AA violations`, async ({ page }) => {
    await page.goto(view.path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await audit(page, view.disableRules)).toEqual([]);
  });
}

test('the helm spins from the keyboard and opens a challenge', async ({ page }) => {
  await page.goto('./#/playground');
  const helm = page.getByRole('button', { name: 'Spin the helm' });
  await helm.focus();
  await expect(helm).toBeFocused();
  await page.keyboard.press('Enter');
  // The result moves focus to its call to action, so Enter again opens the challenge
  const start = page.getByRole('button', { name: 'Start challenge' });
  await expect(start).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/challenge=[a-z0-9-]+/);
});
