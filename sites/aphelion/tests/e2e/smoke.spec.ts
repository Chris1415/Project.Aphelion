import { test, expect } from '@playwright/test';

/**
 * LIVE smoke — renders the real app against the live tenant and asserts the
 * binding invariants that must hold on ANY route that renders: chrome present,
 * no MissingComponent / unknown-component banner, no JS console errors.
 *
 * Routes not yet authored return 404 and are skipped (annotated) — the suite
 * auto-covers them once they're composed in XM Cloud Pages.
 */
const ROUTES = ['/', '/Group-1-Test', '/destinations', '/experiences', '/about', '/contact'];

// Content/asset issues (e.g. an unpublished media item) are not code defects.
const BENIGN = [/Failed to load resource/i, /Download the React DevTools/i, /favicon/i];

for (const route of ROUTES) {
  test(`smoke: ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => {
      if (m.type() === 'error' && !BENIGN.some((re) => re.test(m.text()))) errors.push(m.text());
    });
    page.on('pageerror', (e) => errors.push(String(e)));

    const resp = await page.goto(route, { waitUntil: 'load' });
    const status = resp?.status() ?? 0;

    if (status === 404) {
      test.info().annotations.push({ type: 'not-authored', description: `${route} → 404 (not composed yet)` });
      test.skip(true, `${route} not authored yet (404)`);
      return;
    }

    expect(status, `HTTP status for ${route}`).toBeLessThan(400);

    // Chrome renders on every real route
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();

    // No missing / unknown component banner anywhere on the page
    const missing = await page
      .getByText(/is not registered|unknown component|MissingComponent|was not found/i)
      .count();
    expect(missing, `missing-component banner on ${route}`).toBe(0);

    // Let hydration settle, then assert a clean console
    await page.waitForTimeout(600);
    expect(errors, `console errors on ${route}`).toEqual([]);
  });
}
