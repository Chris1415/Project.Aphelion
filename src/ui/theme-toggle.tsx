'use client';

/**
 * ThemeToggle — 3-state theme cycle button with mounted-flag
 * ADR-0004: mounted-flag ensures server render emits stable placeholder,
 * client updates to real choice after hydration (prevents text-content mismatch).
 *
 * Uses useSyncExternalStore for mount detection to avoid setState-in-effect
 * (Next16/React19 react-hooks plugin errors on that pattern).
 *
 * Glyphs/labels per POC: light:☀ Light · dark:☾ Dark · system:◑ System
 * Toggle visibility gated by NEXT_PUBLIC_SHOW_THEME_TOGGLE (default: shown).
 * Lives in src/ui/ — NOT src/components/ (ADR-0007).
 */

import { useSyncExternalStore } from 'react';
import { useTheme } from './theme-provider';
import type { ThemeChoice } from './theme-provider';

const GLYPH: Record<ThemeChoice, string> = {
  light: '☀',
  dark: '☾',
  system: '◑',
};

const LABEL: Record<ThemeChoice, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

const SHOW = process.env.NEXT_PUBLIC_SHOW_THEME_TOGGLE !== 'false';

// useSyncExternalStore-based mount detection (avoids setState-in-effect)
function subscribeNoop() { return () => {}; }
function getMountedSnapshot() { return true; }
function getMountedServerSnapshot() { return false; }

export function ThemeToggle() {
  const { choice, cycleChoice } = useTheme();
  // mounted-flag via useSyncExternalStore: server=false, client=true
  // No setState-in-effect — this is the canonical Next16/React19 pattern.
  const mounted = useSyncExternalStore(subscribeNoop, getMountedSnapshot, getMountedServerSnapshot);

  if (!SHOW) return null;

  // Server render (mounted=false): stable placeholder with non-empty content
  // so the DOM node exists and text length > 0 on both server and client first paint.
  const glyph = mounted ? GLYPH[choice] : '◑';
  const label = mounted ? LABEL[choice] : 'System';
  const ariaLabel = `Theme: ${label}. Activate to change.`;

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={ariaLabel}
      title={ariaLabel}
      onClick={cycleChoice}
      data-theme-toggle
    >
      <span data-theme-icon aria-hidden="true">{glyph}</span>
      <span data-theme-text>{label}</span>
    </button>
  );
}
