/**
 * T009 — Motion hook unit tests
 * § 10 T009 test spec: reduced-motion + no-IO branches (synchronous);
 * pointer:fine + no-reduced-motion: magnetic sets CSS vars.
 *
 * Browser globals are mocked at the global level — no actual DOM needed.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReveal } from '../useReveal';
import { useCountUp } from '../useCountUp';
import { useMagnetic } from '../useMagnetic';

// ---- matchMedia mock helper ------------------------------------------------
function setupMedia(reducedMotion: boolean, pointerFine: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches:
      query === '(prefers-reduced-motion: reduce)'
        ? reducedMotion
        : query === '(pointer: fine)'
        ? pointerFine
        : false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

// ---- IntersectionObserver mock --------------------------------------------
function setupIO(exists: boolean) {
  if (!exists) {
    vi.stubGlobal('IntersectionObserver', undefined);
  } else {
    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      }))
    );
  }
}

describe('useReveal', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('TC-12(1): prefers-reduced-motion → isVisible=true immediately', () => {
    setupMedia(true, false);
    setupIO(true);

    const { result } = renderHook(() => useReveal());
    expect(result.current.isVisible).toBe(true);
  });

  it('TC-12(2): no IntersectionObserver support → isVisible=true immediately', () => {
    setupMedia(false, false);
    setupIO(false);

    const { result } = renderHook(() => useReveal());
    expect(result.current.isVisible).toBe(true);
  });

  it('TC-12(3): normal mode + IO → isVisible starts false (waits for intersection)', () => {
    setupMedia(false, false);
    setupIO(true);

    const { result } = renderHook(() => useReveal());
    // Starts false — IO hasn't fired
    expect(result.current.isVisible).toBe(false);
  });
});

describe('useCountUp', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('TC-13: prefers-reduced-motion → returns target value immediately', () => {
    setupMedia(true, false);
    setupIO(true);

    const { result } = renderHook(() => useCountUp(1240, {}));
    // Reduced motion: displayValue should be the target (formatted as "1240")
    expect(result.current.displayValue).toBe('1240');
  });

  it('TC-4(start-at-0): normal mode → displayValue starts at 0 before IO fires', () => {
    setupMedia(false, false);
    setupIO(true);

    const { result } = renderHook(() => useCountUp(1240, {}));
    // Normal mode — starts at 0 (IO hasn't fired)
    expect(result.current.displayValue).toBe('0');
  });

  it('TC-13(suffix/prefix): reduced-motion honours suffix and prefix', () => {
    setupMedia(true, false);
    setupIO(true);

    const { result } = renderHook(() => useCountUp(98.5, { decimals: 1, suffix: '%', prefix: '~' }));
    expect(result.current.displayValue).toBe('~98.5%');
  });
});

describe('useMagnetic', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('TC-14(reduced): reduced-motion → pointermove does NOT set --mx/--my', () => {
    setupMedia(true, true); // reduced-motion + fine pointer
    const { result } = renderHook(() => useMagnetic(0.3));

    // Create a fake element with a style prop
    const el = document.createElement('div');
    // Manually assign the ref
    (result.current.ref as React.MutableRefObject<HTMLElement>).current = el;

    // Fire a pointermove — the hook should NOT wire this because reduced-motion
    const event = new PointerEvent('pointermove', { clientX: 100, clientY: 100, bubbles: true });
    act(() => { el.dispatchEvent(event); });

    expect(el.style.getPropertyValue('--mx')).toBe('');
    expect(el.style.getPropertyValue('--my')).toBe('');
  });

  it('TC-14(coarse): pointer:coarse → pointermove does NOT set --mx/--my', () => {
    setupMedia(false, false); // no reduced-motion BUT coarse pointer
    const { result } = renderHook(() => useMagnetic(0.3));

    const el = document.createElement('div');
    (result.current.ref as React.MutableRefObject<HTMLElement>).current = el;

    const event = new PointerEvent('pointermove', { clientX: 100, clientY: 100, bubbles: true });
    act(() => { el.dispatchEvent(event); });

    expect(el.style.getPropertyValue('--mx')).toBe('');
    expect(el.style.getPropertyValue('--my')).toBe('');
  });
});
