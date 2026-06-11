import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config — fully wired at T033 (fidelity gate) + T037 (a11y/contrast).
 *
 * Projects:
 * - chromium-desktop (1440×900): default Desktop Chrome
 * - chromium-mobile (390×844): iPhone 14 viewport
 *
 * Both projects run the full e2e suite.
 * screenshot baselines are stored under tests/e2e/__screenshots__/ (default).
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
    // Desktop 1440 — Chromium Desktop Chrome
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        browserName: 'chromium',
      },
    },
    // Mobile 390 — Chromium with mobile viewport (NOT webkit/iPhone device)
    {
      name: 'chromium-mobile',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 390, height: 844 },
        browserName: 'chromium',
      },
    },
  ],

  // Start a Next.js production build for E2E tests (consistent render for screenshots)
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
