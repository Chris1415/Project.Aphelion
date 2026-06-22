'use client';

/**
 * useCountUp — scroll-triggered easeOutCubic number animation.
 * Reduced-motion: returns target value immediately (derived from snapshot).
 * Normal: starts at 0, animates to countTo on intersection.
 *
 * Browser globals accessed ONLY inside useEffect (NFR-2).
 * Completely avoids setState-in-effect (Next16 react-hooks plugin rule).
 */

import { useRef, useState, useEffect, useSyncExternalStore } from 'react';

interface UseCountUpOptions {
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

function subscribeRM(cb: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
}
const getRMSnapshot = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const getRMServerSnapshot = () => false;

export function useCountUp(
  countTo: number,
  options: UseCountUpOptions = {}
): { ref: React.RefObject<HTMLElement | null>; displayValue: string } {
  const { decimals = 0, suffix = '', prefix = '', duration = 1400 } = options;

  const ref = useRef<HTMLElement | null>(null);

  // Reactive reduced-motion — no setState-in-effect
  const reducedMotion = useSyncExternalStore(subscribeRM, getRMSnapshot, getRMServerSnapshot);

  // IO-driven animated value (starts at 0; IO fires the animation)
  const [ioValue, setIoValue] = useState<number>(0);

  useEffect(() => {
    const hasIO = 'IntersectionObserver' in window && typeof window.IntersectionObserver === 'function';

    if (reducedMotion || !hasIO) {
      // Reduced motion: skip IO — derive final value from snapshot directly
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);

          let startTime: number | null = null;
          function step(ts: number) {
            if (startTime === null) startTime = ts;
            const elapsed = ts - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            setIoValue(countTo * eased);
            if (progress < 1) requestAnimationFrame(step);
            else setIoValue(countTo);
          }
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [countTo, duration, reducedMotion]);

  // Derive final value: reduced-motion → countTo immediately; otherwise animate
  const value = reducedMotion ? countTo : ioValue;
  const formatted = `${prefix}${value.toFixed(decimals)}${suffix}`;
  return { ref, displayValue: formatted };
}
