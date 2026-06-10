'use client';

/**
 * ThemeProvider — 3-state theme store via useSyncExternalStore
 * ADR-0004: FOUC preflight (public/theme-init.js) + useSyncExternalStore provider
 *           (NOT setState-in-effect — Next16/React19 react-hooks plugin errors on that)
 *
 * All browser-global reads (localStorage, matchMedia) live ONLY inside
 * subscribe/getSnapshot — NEVER in render or useState init (NFR-2).
 */

import { createContext, useContext, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';

export type ThemeChoice = 'light' | 'dark' | 'system';

const ORDER: ThemeChoice[] = ['light', 'dark', 'system'];
const STORAGE_KEY = 'aphelion-theme';

// ---- Pure logic helpers (exported for unit tests / T006a) ------------------

/** Resolve a 3-state choice to a concrete 'light' | 'dark' applied value */
export function resolveTheme(choice: ThemeChoice): 'light' | 'dark' {
  if (choice === 'system') {
    // Browser globals accessed here — this is called only from subscribe/getSnapshot
    // which runs client-side only (after hydration), satisfying NFR-2.
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark'; // SSR fallback
  }
  return choice;
}

/** A headless store object — exported for unit tests */
export function createThemeStore() {
  let _choice: ThemeChoice = 'system';

  function getChoice(): ThemeChoice {
    return _choice;
  }

  function setChoice(choice: ThemeChoice) {
    _choice = choice;
    const resolved = resolveTheme(choice);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', resolved);
      document.documentElement.setAttribute('data-theme-choice', choice);
    }
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // storage may be blocked — safe to ignore
    }
  }

  function cycleChoice() {
    const i = ORDER.indexOf(_choice);
    const next = ORDER[(i + 1) % ORDER.length];
    setChoice(next);
  }

  function handleStorageEvent(event: { key: string | null; newValue: string | null }) {
    if (event.key !== STORAGE_KEY) return;
    const newChoice = (event.newValue as ThemeChoice) || 'system';
    _choice = newChoice;
    const resolved = resolveTheme(newChoice);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', resolved);
      document.documentElement.setAttribute('data-theme-choice', newChoice);
    }
  }

  function handleSystemChange() {
    if (_choice !== 'system') return;
    const resolved = resolveTheme('system');
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', resolved);
    }
  }

  return { getChoice, setChoice, cycleChoice, handleStorageEvent, handleSystemChange };
}

// ---- useSyncExternalStore-based provider -----------------------------------

type ThemeStore = {
  choice: ThemeChoice;
  resolved: 'light' | 'dark';
  setChoice: (c: ThemeChoice) => void;
  cycleChoice: () => void;
};

// Module-level singleton store + subscriber list
let _storeChoice: ThemeChoice = 'system';
const _listeners = new Set<() => void>();

function _notify() {
  _listeners.forEach((fn) => fn());
}

function _readChoice(): ThemeChoice {
  if (typeof localStorage !== 'undefined') {
    try {
      return (localStorage.getItem(STORAGE_KEY) as ThemeChoice) || 'system';
    } catch {
      return 'system';
    }
  }
  return 'system';
}

function _applyTheme(choice: ThemeChoice) {
  _storeChoice = choice;
  const resolved = resolveTheme(choice);
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.setAttribute('data-theme-choice', choice);
  }
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, choice);
    }
  } catch {
    // ignore storage errors
  }
}

function subscribe(callback: () => void): () => void {
  // Register the React re-render callback
  _listeners.add(callback);

  // Sync current choice from storage on first subscribe (client only)
  if (typeof window !== 'undefined') {
    _storeChoice = _readChoice();
    _applyTheme(_storeChoice);
  }

  // Subscribe to cross-tab storage events
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    const newChoice = (e.newValue as ThemeChoice) || 'system';
    _storeChoice = newChoice;
    _applyTheme(newChoice);
    _notify();
  };

  // Subscribe to OS dark-mode changes (only matters when on 'system')
  const onSystemChange = () => {
    if (_storeChoice !== 'system') return;
    _applyTheme('system');
    _notify();
  };

  window.addEventListener('storage', onStorage);
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  mql.addEventListener('change', onSystemChange);

  return () => {
    _listeners.delete(callback);
    window.removeEventListener('storage', onStorage);
    mql.removeEventListener('change', onSystemChange);
  };
}

function getSnapshot(): ThemeChoice {
  // Client snapshot — reads from the store
  return _storeChoice;
}

function getServerSnapshot(): ThemeChoice {
  // Server snapshot — deterministic, never accesses localStorage/window
  return 'system';
}

// ---- React context ----------------------------------------------------------

const ThemeContext = createContext<ThemeStore | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const choice = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function setChoiceAndNotify(c: ThemeChoice) {
    _storeChoice = c;
    _applyTheme(c);
    _notify();
  }

  function cycleAndNotify() {
    const i = ORDER.indexOf(_storeChoice);
    const next = ORDER[(i + 1) % ORDER.length];
    setChoiceAndNotify(next);
  }

  const resolved = resolveTheme(choice);

  const value: ThemeStore = {
    choice,
    resolved,
    setChoice: setChoiceAndNotify,
    cycleChoice: cycleAndNotify,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeStore {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
}
