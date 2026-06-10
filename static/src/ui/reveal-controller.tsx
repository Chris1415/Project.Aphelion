'use client';

/**
 * RevealController — global IntersectionObserver-based scroll reveal.
 * Mounted once in src/app/layout.tsx. Renders nothing.
 *
 * Behaviour:
 *   - prefers-reduced-motion OR no IntersectionObserver → add .in to all immediately, skip IO.
 *   - Normal: one IO (threshold 0.12, rootMargin 0px 0px -8% 0px), adds .in on intersect.
 *   - Safety net: 1 500 ms setTimeout adds .in to any still-unrevealed elements so content
 *     can NEVER stay permanently hidden (handles edge cases: lazy-loaded content, test envs).
 *
 * All browser-global access is inside useEffect (NFR-2 compliant).
 * Pure DOM classList mutation — no React state involved.
 */

import { useEffect } from 'react';

export function RevealController() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (elements.length === 0) return;

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const hasIO =
      typeof window !== 'undefined' &&
      'IntersectionObserver' in window &&
      typeof window.IntersectionObserver === 'function';

    // Reveal all immediately — used for reduced-motion and no-IO paths
    function revealAll() {
      elements.forEach((el) => el.classList.add('in'));
    }

    if (reducedMotion || !hasIO) {
      revealAll();
      return;
    }

    // Safety-net: ensure content is never permanently hidden
    const safetyTimer = setTimeout(() => {
      elements.forEach((el) => {
        if (!el.classList.contains('in')) {
          el.classList.add('in');
        }
      });
    }, 1500);

    // IntersectionObserver — one instance for all [data-reveal] elements
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      clearTimeout(safetyTimer);
      observer.disconnect();
    };
  }, []);

  // Renders nothing — purely a side-effect mount
  return null;
}
