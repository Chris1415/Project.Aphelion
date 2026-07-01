/**
 * Motion utility hooks — useReveal, useCountUp, useMagnetic
 * ADR-0007: lives in src/lib/motion/ (NOT src/components/).
 * NFR-2: ALL browser globals (IntersectionObserver, matchMedia, window)
 *         accessed ONLY inside useEffect — NEVER in render or hook body init.
 *
 * Reduced-motion is respected by all three hooks (CSS also freezes via globals.css).
 */

export { useReveal } from './useReveal';
export { useCountUp } from './useCountUp';
export { useMagnetic } from './useMagnetic';
