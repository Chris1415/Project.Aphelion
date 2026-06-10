'use client';

/**
 * useReveal — scroll-triggered reveal via IntersectionObserver.
 * Reduced-motion or no IO support: immediately visible.
 * Normal: reveals on intersection.
 *
 * Browser globals accessed ONLY via useSyncExternalStore snapshots or inside
 * useEffect callbacks (NFR-2 — no window access in render body).
 * Completely avoids setState-in-effect (Next16 react-hooks plugin rule).
 */

import { useRef, useState, useEffect, useSyncExternalStore } from 'react';

interface UseRevealOptions {
  threshold?: number;
  rootMargin?: string;
}

// useSyncExternalStore for reduced-motion OS pref
function subscribeRM(cb: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
}
const getRMSnapshot = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const getRMServerSnapshot = () => false;

// useSyncExternalStore for IO support (static — never actually changes at runtime)
function subscribeNoop() { return () => {}; }
const getIOSnapshot = () =>
  typeof window !== 'undefined' &&
  'IntersectionObserver' in window &&
  typeof window.IntersectionObserver === 'function';
const getIOServerSnapshot = () => false;

export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseRevealOptions = {}
): { ref: React.RefObject<T | null>; isVisible: boolean } {
  const ref = useRef<T | null>(null);

  // Read reduced-motion and IO support via useSyncExternalStore — no render-time window access
  const reducedMotion = useSyncExternalStore(subscribeRM, getRMSnapshot, getRMServerSnapshot);
  const hasIO = useSyncExternalStore(subscribeNoop, getIOSnapshot, getIOServerSnapshot);

  // IO-triggered visibility state (only for when IO is available and motion is on)
  const [ioVisible, setIoVisible] = useState(false);

  useEffect(() => {
    if (reducedMotion || !hasIO) {
      // No IO or reduced-motion: derive immediately visible from snapshot (see return value)
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIoVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: options.threshold ?? 0.16,
        rootMargin: options.rootMargin ?? '0px 0px -8% 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, hasIO]);

  // Derive visibility: immediate for reduced-motion/no-IO; IO-driven otherwise
  const isVisible = reducedMotion || !hasIO || ioVisible;

  return { ref, isVisible };
}
