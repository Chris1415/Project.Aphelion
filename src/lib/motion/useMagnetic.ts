'use client';

/**
 * useMagnetic — pointer-fine + reduced-motion gated magnetic hover.
 * Sets --mx/--my CSS vars on the element proportional to cursor distance × strength.
 * Resets on pointerleave.
 *
 * Coarse pointer (touch) or reduced-motion: no-op.
 * Browser globals accessed ONLY inside useEffect (NFR-2).
 */

import { useRef, useEffect } from 'react';

export function useMagnetic<T extends HTMLElement = HTMLElement>(
  strength: number = 0.3
): { ref: React.RefObject<T | null> } {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    // Browser globals only inside useEffect (NFR-2)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (reducedMotion || !isFinePointer) {
      // No-op: leave --mx/--my at their default (0)
      return;
    }

    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - (rect.left + rect.width / 2);
      const my = e.clientY - (rect.top + rect.height / 2);
      el.style.setProperty('--mx', `${(mx * strength).toFixed(2)}px`);
      el.style.setProperty('--my', `${(my * strength).toFixed(2)}px`);
    };

    const onLeave = () => {
      el.style.setProperty('--mx', '0px');
      el.style.setProperty('--my', '0px');
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);

    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [strength]);

  return { ref };
}
