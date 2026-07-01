'use client';

/**
 * RevealController — global scroll-reveal for [data-reveal] elements.
 * Mounted once in src/app/layout.tsx. Renders nothing.
 *
 * Why a MutationObserver (not a usePathname-keyed effect):
 *   The layout — and therefore this controller — stays mounted across App Router
 *   client-side (soft) navigations. A one-shot effect (or even a pathname-keyed one)
 *   races the new route's DOM commit, so pages reached by CLICKING a nav link keep
 *   their content hidden ("home fine, every other page broken"). A MutationObserver
 *   registers [data-reveal] elements as they appear — initial load, EVERY client
 *   navigation, and streamed/Suspense content — with no timing assumptions.
 *
 * Behaviour:
 *   - prefers-reduced-motion OR no IntersectionObserver → reveal everything (now + future).
 *   - Normal: above-fold elements reveal immediately (so a freshly-navigated page is never
 *     blank); below-fold elements reveal on scroll via IntersectionObserver.
 *
 * All browser-global access is inside useEffect (NFR-2 compliant).
 * Pure DOM classList mutation — no React state involved.
 */

import { useEffect } from 'react';

export function RevealController() {
  useEffect(() => {
    const reveal = (el: Element) => el.classList.add('in');

    const reducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const hasIO =
      typeof window !== 'undefined' &&
      'IntersectionObserver' in window &&
      typeof window.IntersectionObserver === 'function';

    // Reduced-motion or no IO: reveal everything present, and anything added later.
    if (reducedMotion || !hasIO) {
      const revealAll = () =>
        document.querySelectorAll('[data-reveal]:not(.in)').forEach(reveal);
      revealAll();
      const mo = new MutationObserver(revealAll);
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    const inViewport = (el: Element) => {
      const r = el.getBoundingClientRect();
      return r.top < (window.innerHeight || 0) && r.bottom > 0 && r.height > 0;
    };

    // Safety net: reveal anything still hidden a short while after the page settles, so
    // content can NEVER stay permanently hidden (covers IO threshold gaps + below-fold on
    // pages the user doesn't scroll). Re-armed on every register() — including after a
    // client-side navigation — so each new page gets its own guarantee. CSS animations do
    // NOT trigger the MutationObserver (it watches DOM structure, not style), so this timer
    // is reset only by real DOM changes (navigation), not by the gooey/marquee animations.
    let safetyTimer: ReturnType<typeof setTimeout> | undefined;
    const armSafety = () => {
      clearTimeout(safetyTimer);
      safetyTimer = setTimeout(() => {
        document.querySelectorAll('[data-reveal]:not(.in)').forEach(reveal);
      }, 1500);
    };

    // Register every not-yet-revealed [data-reveal]: above-fold reveals immediately
    // (guarantees a freshly-navigated page is never blank); below-fold observes for scroll.
    // Deferred one frame so the just-committed (navigated) DOM is laid out before the
    // inViewport() measurement — otherwise newly-mounted elements read height 0 and fall
    // through to the slower IO/safety path, making above-fold content appear late on nav.
    let rafId = 0;
    const register = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        document.querySelectorAll<HTMLElement>('[data-reveal]:not(.in)').forEach((el) => {
          if (inViewport(el)) reveal(el);
          else io.observe(el);
        });
        armSafety();
      });
    };

    register();

    // Catch elements added by client-side navigation / streaming.
    const mo = new MutationObserver(register);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(safetyTimer);
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  // Renders nothing — purely a side-effect mount.
  return null;
}
