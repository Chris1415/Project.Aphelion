/**
 * T006a — ThemeProvider / useTheme store RED tests
 * TDD RED phase: these tests fail until T006b implements the store.
 *
 * Test contract per § 10 T006a:
 *   - resolveTheme() logic
 *   - setChoice DOM + localStorage writes
 *   - cycle order light → dark → system → light
 *   - storage event re-sync
 *   - matchMedia change event re-resolution
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// ---- localStorage mock factory (closure-based, avoids `this.store` typing) ---
function makeLocalStorageMock() {
  const store: Record<string, string> = {};
  return {
    getItem(k: string) { return store[k] ?? null; },
    setItem(k: string, v: string) { store[k] = v; },
    removeItem(k: string) { delete store[k]; },
    clear() { Object.keys(store).forEach((k) => delete store[k]); },
  };
}

// ---- Mock matchMedia and localStorage BEFORE importing the module ----------
type MockMQL = {
  matches: boolean;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
  dispatchEvent: ReturnType<typeof vi.fn>;
  _listeners: Array<(e: { matches: boolean }) => void>;
};

let mockDarkMQL: MockMQL;

function setupMediaMock(systemIsDark: boolean) {
  mockDarkMQL = {
    matches: systemIsDark,
    addEventListener: vi.fn((type: string, fn: (e: { matches: boolean }) => void) => {
      if (type === 'change') mockDarkMQL._listeners.push(fn);
    }),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    _listeners: [],
  };
  vi.stubGlobal('matchMedia', (query: string) => {
    if (query === '(prefers-color-scheme: dark)') return mockDarkMQL;
    return { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() };
  });
}

function triggerSystemChange(newDark: boolean) {
  mockDarkMQL.matches = newDark;
  mockDarkMQL._listeners.forEach((fn) => fn({ matches: newDark }));
}

// Import the module under test — will fail with "Cannot find module" until T006b
// That failure IS the expected RED state.
import {
  resolveTheme,
  createThemeStore,
} from '../theme-provider';

describe('ThemeProvider store — resolveTheme', () => {
  it('resolveTheme("system") returns "dark" when matchMedia matches dark', () => {
    setupMediaMock(true);
    expect(resolveTheme('system')).toBe('dark');
  });

  it('resolveTheme("system") returns "light" when matchMedia does NOT match dark', () => {
    setupMediaMock(false);
    expect(resolveTheme('system')).toBe('light');
  });

  it('resolveTheme("dark") returns "dark" regardless of matchMedia', () => {
    setupMediaMock(false);
    expect(resolveTheme('dark')).toBe('dark');
  });

  it('resolveTheme("light") returns "light" regardless of matchMedia', () => {
    setupMediaMock(true);
    expect(resolveTheme('light')).toBe('light');
  });
});

describe('ThemeProvider store — setChoice DOM + localStorage', () => {
  beforeEach(() => {
    setupMediaMock(true);
    vi.stubGlobal('localStorage', makeLocalStorageMock());
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-theme-choice');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('setChoice("dark") writes data-theme="dark" on documentElement', () => {
    const store = createThemeStore();
    store.setChoice('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('setChoice("dark") persists localStorage("aphelion-theme") = "dark"', () => {
    const store = createThemeStore();
    store.setChoice('dark');
    expect(localStorage.getItem('aphelion-theme')).toBe('dark');
  });

  it('setChoice("system") with systemDark=true sets data-theme="dark" but persists "system"', () => {
    setupMediaMock(true);
    const store = createThemeStore();
    store.setChoice('system');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('aphelion-theme')).toBe('system');
  });
});

describe('ThemeProvider store — cycle order', () => {
  beforeEach(() => {
    setupMediaMock(false);
    vi.stubGlobal('localStorage', makeLocalStorageMock());
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('cycle order is light → dark → system → light', () => {
    const store = createThemeStore();
    // Start at light
    store.setChoice('light');
    expect(store.getChoice()).toBe('light');

    store.cycleChoice();
    expect(store.getChoice()).toBe('dark');

    store.cycleChoice();
    expect(store.getChoice()).toBe('system');

    store.cycleChoice();
    expect(store.getChoice()).toBe('light');
  });
});

describe('ThemeProvider store — storage + matchMedia events', () => {
  beforeEach(() => {
    setupMediaMock(true);
    vi.stubGlobal('localStorage', makeLocalStorageMock());
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('storage event with key="aphelion-theme" newValue="light" causes data-theme to become "light"', () => {
    const store = createThemeStore();
    store.setChoice('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    // Simulate cross-tab storage event
    store.handleStorageEvent({ key: 'aphelion-theme', newValue: 'light' });
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('matchMedia change while on "system" (dark→light): data-theme updates to "light"', () => {
    setupMediaMock(true);
    const store = createThemeStore();
    store.setChoice('system');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    // System changes to light
    triggerSystemChange(false);
    store.handleSystemChange();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('matchMedia change while on explicit "dark": data-theme stays "dark"', () => {
    const store = createThemeStore();
    store.setChoice('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    // System changes to light — explicit choice should NOT update
    triggerSystemChange(false);
    store.handleSystemChange();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
