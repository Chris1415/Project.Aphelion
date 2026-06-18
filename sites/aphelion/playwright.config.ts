import { defineConfig, devices } from '@playwright/test';

/**
 * Head-app LIVE smoke — renders the real app against the live tenant and asserts
 * binding invariants per route (chrome present, no MissingComponent banner,
 * console clean). This is the true end-to-end layer the static suite never had.
 *
 * webServer runs `npm run start`, which does a FRESH production build then
 * `next start` — deliberately NOT reusing a possibly-stale dev server (that
 * false-green trap bit this project before; see reveal-regression notes).
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, browserName: 'chromium' },
    },
    {
      name: 'chromium-mobile',
      use: { ...devices['Pixel 5'], viewport: { width: 390, height: 844 }, browserName: 'chromium' },
    },
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
