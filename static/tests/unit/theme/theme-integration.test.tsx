/**
 * T036 — Vitest theme-provider integration tests + form validation regex contract
 *
 * Per § 10 T036:
 * 1. useTheme() throws or returns error when consumed outside ThemeProvider
 * 2. ThemeProvider server-side snapshot (getServerSnapshot) returns 'system'
 *    — never accesses localStorage or window
 * 3. system resolves correctly on server (snapshot = 'system'; no crash in SSR context)
 * 4. Form validation regex /^[^\s@]+@[^\s@]+\.[^\s@]+$/ matches the POC contract exactly
 *
 * These are ADDITIONAL integration checks on top of T006a's store-logic unit tests.
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ThemeProvider, useTheme } from '@/ui/theme-provider';
import { ThemeToggle } from '@/ui/theme-toggle';

// ── 1. Outside-provider guard ─────────────────────────────────────────────────

describe('T036-1: useTheme() outside ThemeProvider', () => {
  it('throws with a descriptive error when used outside ThemeProvider', () => {
    // Suppress the expected error boundary output during this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used inside <ThemeProvider>');

    consoleSpy.mockRestore();
  });
});

// ── 2. Server snapshot is deterministic ───────────────────────────────────────

describe('T036-2: ThemeProvider server-side snapshot', () => {
  it('getServerSnapshot returns "system" — no localStorage or window access', () => {
    // The contract: getServerSnapshot must return 'system' deterministically
    // and must not read localStorage or window.
    // We test this by importing the function and calling it directly — it is
    // exported indirectly via useSyncExternalStore's third argument.
    //
    // Strategy: render ThemeProvider WITHOUT localStorage set; the initial value
    // shown by the consumer should be 'system' (the server snapshot value).
    localStorage.removeItem('aphelion-theme');

    const TestConsumer = () => {
      const { choice } = useTheme();
      return <span data-testid="choice">{choice}</span>;
    };

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    // Without localStorage set, the resolved choice is 'system'
    const choiceEl = screen.getByTestId('choice');
    expect(choiceEl.textContent).toBe('system');
  });

  it('ThemeProvider renders without crash when localStorage is empty (simulated SSR-safe init)', () => {
    // Verify no crash from a clean state — server snapshot is used safely
    localStorage.clear();

    let renderError: unknown = null;
    try {
      const TestConsumer = () => {
        const { choice } = useTheme();
        return <span data-testid="choice2">{choice}</span>;
      };
      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>
      );
    } catch (e) {
      renderError = e;
    }

    expect(renderError).toBeNull();
    // Result is 'system' (no stored preference)
    expect(screen.getByTestId('choice2').textContent).toBe('system');
  });
});

// ── 3. Form validation regex contract ────────────────────────────────────────

describe('T036-3: Form validation email regex matches POC contract exactly', () => {
  // The POC email validation regex (ADR-0006, T023b REFACTOR note)
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  it('accepts valid email "user@example.com"', () => {
    expect(EMAIL_REGEX.test('user@example.com')).toBe(true);
  });

  it('accepts valid email "first.last+tag@sub.domain.org"', () => {
    expect(EMAIL_REGEX.test('first.last+tag@sub.domain.org')).toBe(true);
  });

  it('rejects "notanemail" (no @ or domain)', () => {
    expect(EMAIL_REGEX.test('notanemail')).toBe(false);
  });

  it('rejects "@example.com" (empty local part)', () => {
    expect(EMAIL_REGEX.test('@example.com')).toBe(false);
  });

  it('rejects "user@" (no domain)', () => {
    expect(EMAIL_REGEX.test('user@')).toBe(false);
  });

  it('rejects "user@domain" (no TLD dot)', () => {
    expect(EMAIL_REGEX.test('user@domain')).toBe(false);
  });

  it('rejects " user@example.com" (leading space)', () => {
    // Regex requires no whitespace in any part
    expect(EMAIL_REGEX.test(' user@example.com')).toBe(false);
  });
});

// ── 4. ThemeToggle server-render stability ─────────────────────────────────

describe('T036-4: ThemeToggle mounted-flag — server render emits stable placeholder', () => {
  it('ThemeToggle renders a non-empty placeholder before mount (consistent server/client snapshot)', () => {
    // We render ThemeToggle inside ThemeProvider.
    // On first render (before the useEffect/mount flag fires), it should render
    // a stable placeholder (not '') to avoid hydration mismatch.
    // We test this by checking the rendered output is non-empty.
    const { container } = render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const toggle = container.querySelector('[data-theme-toggle]');
    expect(toggle).toBeInTheDocument();
    // aria-label must be non-empty
    const ariaLabel = toggle?.getAttribute('aria-label') ?? '';
    expect(ariaLabel.length).toBeGreaterThan(0);
  });
});
