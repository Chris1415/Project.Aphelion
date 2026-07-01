import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

/**
 * jsdom browser-API stubs used by the motion hooks (useMagnetic / useReveal /
 * useCountUp) inside useEffect. jsdom provides none of these. Tests may override
 * (e.g. to simulate reduced-motion ON).
 */
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
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

class StubObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): [] {
    return [];
  }
}
if (!('IntersectionObserver' in globalThis)) {
  (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = StubObserver;
}
if (!('ResizeObserver' in globalThis)) {
  (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = StubObserver;
}

/**
 * Global SDK context mock.
 *
 * Components call `useSitecore()` to read `page.mode.isEditing`. In unit tests
 * we want the PUBLISHED view (isEditing = false) so empty-state filtering and
 * real bindings are exercised. Everything else from the SDK (Text/Image/Link
 * field helpers) stays REAL — binding is genuinely tested, not stubbed.
 *
 * Override per-test where editing-mode behaviour matters:
 *   vi.mocked(useSitecore).mockReturnValue({ page: { mode: { isEditing: true } } })
 */
vi.mock('@sitecore-content-sdk/nextjs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@sitecore-content-sdk/nextjs')>();
  return {
    ...actual,
    useSitecore: () => ({ page: { mode: { isEditing: false } } }),
  };
});
