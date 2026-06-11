import '@testing-library/jest-dom';

/**
 * Global jsdom stubs for browser APIs used by motion hooks.
 * useMagnetic / useReveal / useCountUp access matchMedia and IntersectionObserver
 * inside useEffect — jsdom doesn't provide these; stub them globally here.
 *
 * Individual tests may override these stubs (e.g. theme-provider.test.ts overrides
 * matchMedia to simulate reduced-motion ON/OFF).
 */

// matchMedia stub (default: no reduced-motion, coarse pointer = no magnetic effects)
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
