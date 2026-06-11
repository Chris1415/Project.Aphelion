/**
 * T012 — Playwright theme/hydration probe
 * § 10 T012 test spec:
 *   - data-theme set BEFORE first paint (FOUC check)
 *   - zero hydration-mismatch console warnings
 *   - zero console errors
 *   - toggle cycles + persists across reload
 *
 * This is the TEST-TRANCHE-FIRST gate (T013). Must pass before content band work begins.
 */

import { test, expect, type Page } from '@playwright/test';

// ---- Helpers ---------------------------------------------------------------

async function getDataTheme(page: Page) {
  return page.evaluate(() => document.documentElement.getAttribute('data-theme'));
}

async function getDataThemeChoice(page: Page) {
  return page.evaluate(() => document.documentElement.getAttribute('data-theme-choice'));
}

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
    if (msg.type() === 'warning' && /hydration/i.test(msg.text())) {
      errors.push(`[hydration warning] ${msg.text()}`);
    }
  });
  return errors;
}

// ---- Tests -----------------------------------------------------------------

test.describe('Theme preflight — FOUC', () => {
  test('(1) dark stored → data-theme="dark" immediately on goto', async ({ page }) => {
    const errors = collectErrors(page);
    // Set localStorage BEFORE goto — use addInitScript to inject before page load
    await page.addInitScript(() => {
      localStorage.setItem('aphelion-theme', 'dark');
    });
    await page.goto('/');
    const theme = await getDataTheme(page);
    expect(theme).toBe('dark');
    expect(errors.filter((e) => /hydration/i.test(e))).toHaveLength(0);
  });

  test('(2) light stored → data-theme="light" before first paint', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('aphelion-theme', 'light');
    });
    await page.goto('/');
    const theme = await getDataTheme(page);
    expect(theme).toBe('light');
  });

  test('(3) system + dark OS pref → data-theme="dark"', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.addInitScript(() => {
      localStorage.removeItem('aphelion-theme');
    });
    await page.goto('/');
    const theme = await getDataTheme(page);
    expect(theme).toBe('dark');
  });

  test('(4) system + light OS pref → data-theme="light"', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.addInitScript(() => {
      localStorage.removeItem('aphelion-theme');
    });
    await page.goto('/');
    const theme = await getDataTheme(page);
    expect(theme).toBe('light');
  });
});

test.describe('Hydration correctness', () => {
  test('(5) zero hydration-mismatch warnings on / in dark', async ({ page }) => {
    const errors = collectErrors(page);
    await page.addInitScript(() => {
      localStorage.setItem('aphelion-theme', 'dark');
    });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const hydrationErrors = errors.filter((e) => /hydration/i.test(e));
    expect(hydrationErrors).toHaveLength(0);
  });

  test('(6) zero console errors on / in dark (first load)', async ({ page }) => {
    const errors = collectErrors(page);
    await page.addInitScript(() => {
      localStorage.setItem('aphelion-theme', 'dark');
    });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    // Filter known benign errors (e.g. failed Unsplash image loads in CI)
    const realErrors = errors.filter(
      (e) => !e.includes('Failed to load resource') && !/hydration/i.test(e)
    );
    expect(realErrors).toHaveLength(0);
  });
});

test.describe('Toggle cycle + persistence', () => {
  test('(7) toggle cycle light→dark→system→light: each data-theme matches resolution rule', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' }); // system = dark
    // Start from 'light'
    await page.addInitScript(() => {
      localStorage.setItem('aphelion-theme', 'light');
    });
    await page.goto('/');

    // Should start light
    expect(await getDataTheme(page)).toBe('light');

    const toggle = page.locator('[data-theme-toggle]').first();

    // light → dark
    await toggle.click();
    await page.waitForTimeout(50);
    expect(await getDataTheme(page)).toBe('dark');

    // dark → system (OS = dark)
    await toggle.click();
    await page.waitForTimeout(50);
    expect(await getDataTheme(page)).toBe('dark'); // system resolves to dark
    expect(await getDataThemeChoice(page)).toBe('system');

    // system → light
    await toggle.click();
    await page.waitForTimeout(50);
    expect(await getDataTheme(page)).toBe('light');
  });

  test('(8) after toggle to dark + hard reload: data-theme stays "dark"', async ({ page }) => {
    // Start from light — use initScript that only sets if unset (doesn't override on reload)
    await page.addInitScript(() => {
      if (!localStorage.getItem('aphelion-theme')) {
        localStorage.setItem('aphelion-theme', 'light');
      }
    });
    await page.goto('/');
    expect(await getDataTheme(page)).toBe('light');

    // Toggle to dark (light → dark)
    const toggle = page.locator('[data-theme-toggle]').first();
    await toggle.click();
    await page.waitForTimeout(200); // give localStorage write time
    expect(await getDataTheme(page)).toBe('dark');

    // Hard reload — addInitScript won't override because key is now 'dark'
    await page.reload();
    const themeAfterReload = await getDataTheme(page);
    expect(themeAfterReload).toBe('dark');
  });
});
