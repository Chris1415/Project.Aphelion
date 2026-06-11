/**
 * Regression test — [data-reveal] reveal controller
 *
 * Verifies that after scrolling a full page:
 *   - ZERO [data-reveal] elements remain at opacity:0 (all revealed)
 *   - With prefers-reduced-motion: reduce, content is also immediately visible
 *
 * RED: fails against the un-fixed app (no reveal controller, unconditional hide)
 * GREEN: passes once reveal-controller.tsx is mounted in layout.tsx
 *
 * Routes tested: all 5 (normal motion scan) + / (reduced-motion scan)
 */

import { test, expect } from '@playwright/test';

const ROUTES = ['/', '/destinations', '/experiences', '/about', '/contact'] as const;

// Helper: scroll page in increments to trigger IntersectionObserver
async function scrollFullPage(page: import('@playwright/test').Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = 400;
  for (let y = 0; y < height; y += step) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    // Small pause so IntersectionObserver callbacks can fire
    await page.waitForTimeout(60);
  }
  // Scroll back to top and bottom once more for elements near fold edge
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(60);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(200);
}

// ── Normal motion: all [data-reveal] elements must be visible after scroll ───

for (const route of ROUTES) {
  test(`reveal: all [data-reveal] elements revealed after scroll — ${route}`, async ({ page }) => {
    // Do NOT force reduced-motion — we want the real IntersectionObserver path
    await page.goto(route);

    // Wait for React hydration to complete
    await page.waitForLoadState('networkidle');

    // Count [data-reveal] elements
    const totalCount = await page.evaluate(() => document.querySelectorAll('[data-reveal]').length);

    // There should always be some on every page
    expect(totalCount).toBeGreaterThan(0);

    // Scroll the full page to trigger the reveal controller
    await scrollFullPage(page);

    // Allow the safety-net timeout a chance if needed (shouldn't be needed, but cap wait)
    // We give IO + safety-net up to 2 500 ms total
    await page.waitForTimeout(500);

    // Count elements still at opacity:0 (not revealed)
    const hiddenCount = await page.evaluate(() => {
      const elements = document.querySelectorAll('[data-reveal]');
      let hidden = 0;
      elements.forEach((el) => {
        const opacity = window.getComputedStyle(el).opacity;
        if (opacity === '0') hidden++;
      });
      return hidden;
    });

    expect(hiddenCount).toBe(0);
  });
}

// ── Reduced motion: content must be immediately visible (no scroll needed) ───

test('reveal: prefers-reduced-motion → all [data-reveal] immediately visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const hiddenCount = await page.evaluate(() => {
    const elements = document.querySelectorAll('[data-reveal]');
    let hidden = 0;
    elements.forEach((el) => {
      const opacity = window.getComputedStyle(el).opacity;
      if (opacity === '0') hidden++;
    });
    return hidden;
  });

  // With reduced-motion: all [data-reveal] have opacity:1 via CSS override
  expect(hiddenCount).toBe(0);
});

// ── No-JS fallback: html.js class absent → content must be visible ───────────

test('reveal: without html.js class → [data-reveal] content is visible (no-JS default)', async ({
  page,
}) => {
  // Simulate a page where JS never added the .js class (no-JS / pre-hydration state)
  // We do this by disabling JavaScript
  await page.context().route('**/*.js', (route) => route.abort());

  // Navigate with JS disabled — theme-init.js won't run so html.js won't be set
  await page.goto('/');

  // Even without JS, content should be visible because hide rule requires html.js
  const hiddenCount = await page.evaluate(() => {
    const elements = document.querySelectorAll('[data-reveal]');
    let hidden = 0;
    elements.forEach((el) => {
      const opacity = window.getComputedStyle(el).opacity;
      if (opacity === '0') hidden++;
    });
    return hidden;
  });

  // Without html.js class, the hide rule doesn't apply → content visible
  expect(hiddenCount).toBe(0);
});

// ── Client-side navigation: reveal MUST re-run on App Router soft navigation ──
// The layout (and RevealController) stays mounted across client-side nav, so the
// reveal effect must re-run on pathname change — otherwise any page reached by
// CLICKING a nav link (not a full reload) keeps its content hidden. The goto-based
// tests above do NOT catch this; only a real link click does. This guards the
// "home fine, every other page broken" regression.

test('reveal: client-side nav (clicking nav links) reveals every route', async ({ page }) => {
  const countHidden = () =>
    page.evaluate(() => {
      let hidden = 0;
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        if (window.getComputedStyle(el).opacity === '0') hidden++;
      });
      return hidden;
    });

  // Clicks the real nav link via soft navigation — desktop nav when visible,
  // otherwise open the mobile drawer first (so this works on both projects).
  async function navClick(route: string) {
    const menuBtn = page.locator('button[data-menu-open]');
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await page.locator(`.mobile-nav a[href="${route}"]`).first().click();
    } else {
      await page.locator(`.nav-desktop a[href="${route}"]`).first().click();
    }
    await page.waitForURL(`**${route}`);
    await page.waitForLoadState('networkidle');
  }

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  for (const route of ['/destinations', '/experiences', '/about', '/contact'] as const) {
    await navClick(route);

    const total = await page.evaluate(
      () => document.querySelectorAll('[data-reveal]').length
    );
    expect(total, `[data-reveal] present after soft-nav to ${route}`).toBeGreaterThan(0);

    await scrollFullPage(page);
    // Wait past the controller's reveal safety-net (1.5s after the page settles) so this
    // asserts the GUARANTEED end-state: content reached by client-side nav is never left
    // permanently hidden. (The goto-based tests above cover the on-scroll IO timing.)
    await page.waitForTimeout(1800);

    expect(await countHidden(), `all [data-reveal] revealed after client-side nav to ${route}`).toBe(
      0
    );
  }
});
