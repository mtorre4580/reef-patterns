import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;

/**
 * Browser tests against the production build (`pnpm build` first).
 * Each spec runs twice, once per theme, so axe checks real contrast in dark and light.
 */
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}/reef-patterns/`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'dark', use: { ...devices['Desktop Chrome'], colorScheme: 'dark' } },
    { name: 'light', use: { ...devices['Desktop Chrome'], colorScheme: 'light' } },
  ],
  webServer: {
    command: `pnpm preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/reef-patterns/`,
    reuseExistingServer: !process.env.CI,
  },
});
