/**
 * T023a — [RED] NewsletterCTA validation tests.
 * TDD RED phase: these tests must FAIL (module not found) before T023b is implemented.
 * After T023b implementation, all tests must be GREEN.
 *
 * TC-24 through TC-28 + TC-19 coverage for NewsletterCTA.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NewsletterCTA } from '../index';

// Mock fetch at module level (ADR-0006: never fetch)
const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(new Response());

const defaultProps = {
  heading: 'Be first to the',
  headingAccent: 'next window.',
  body: 'Charter releases and route previews. No noise.',
  placeholder: 'you@orbit.example',
  buttonLabel: 'Join the manifest',
};

beforeEach(() => {
  fetchSpy.mockClear();
});

describe('NewsletterCTA', () => {
  // TC-19 — all four flat props render in DOM
  it('(1) renders heading, body, placeholder, buttonLabel from props', () => {
    render(<NewsletterCTA {...defaultProps} />);
    expect(screen.getByText('Be first to the')).toBeInTheDocument();
    expect(
      screen.getByText('Charter releases and route previews. No noise.')
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@orbit.example')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Join the manifest/i })).toBeInTheDocument();
  });

  // TC-24 — empty submit → aria-invalid + "Email is required." + focus
  it('(2) empty submit: aria-invalid="true", error "Email is required.", input focused', async () => {
    const user = userEvent.setup();
    render(<NewsletterCTA {...defaultProps} />);
    const submitBtn = screen.getByRole('button', { name: /Join the manifest/i });
    await user.click(submitBtn);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Email is required.')).toBeInTheDocument();
    expect(document.activeElement).toBe(input);
  });

  // TC-25 — invalid email → aria-invalid + "Enter a valid email address."
  it('(3) invalid email submit: aria-invalid="true", error "Enter a valid email address."', async () => {
    const user = userEvent.setup();
    render(<NewsletterCTA {...defaultProps} />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'notanemail');
    await user.click(screen.getByRole('button', { name: /Join the manifest/i }));

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
  });

  // TC-26 — valid submit → form hidden, .nl-success visible
  it('(4) valid email submit: form hidden, success element visible', async () => {
    const user = userEvent.setup();
    render(<NewsletterCTA {...defaultProps} />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'user@example.com');
    await user.click(screen.getByRole('button', { name: /Join the manifest/i }));

    // Form should be gone / hidden; success element visible
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  // TC-26 continued — success element has role="status"
  it('(5) success element has role="status"', async () => {
    const user = userEvent.setup();
    render(<NewsletterCTA {...defaultProps} />);
    await user.type(screen.getByRole('textbox'), 'user@example.com');
    await user.click(screen.getByRole('button', { name: /Join the manifest/i }));
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  // TC-26 continued — success element receives focus
  it('(6) success element receives programmatic focus after valid submit', async () => {
    const user = userEvent.setup();
    render(<NewsletterCTA {...defaultProps} />);
    await user.type(screen.getByRole('textbox'), 'user@example.com');
    await user.click(screen.getByRole('button', { name: /Join the manifest/i }));
    const successEl = screen.getByRole('status');
    expect(document.activeElement).toBe(successEl);
  });

  // TC-27 — input event clears aria-invalid
  it('(7) input event while aria-invalid="true" clears aria-invalid', async () => {
    const user = userEvent.setup();
    render(<NewsletterCTA {...defaultProps} />);
    const input = screen.getByRole('textbox');
    // Trigger error state first
    await user.click(screen.getByRole('button', { name: /Join the manifest/i }));
    expect(input).toHaveAttribute('aria-invalid', 'true');
    // Type into the input — should clear aria-invalid
    await user.type(input, 'a');
    expect(input).not.toHaveAttribute('aria-invalid', 'true');
  });

  // TC-28 — submit handler NEVER calls fetch (ADR-0006 regression-critical)
  it('(8) submit handler never calls window.fetch', async () => {
    const user = userEvent.setup();
    render(<NewsletterCTA {...defaultProps} />);
    // Try with invalid email
    await user.click(screen.getByRole('button', { name: /Join the manifest/i }));
    expect(fetchSpy).not.toHaveBeenCalled();
    // Try with valid email
    await user.type(screen.getByRole('textbox'), 'user@example.com');
    await user.click(screen.getByRole('button', { name: /Join the manifest/i }));
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  // Belt-and-suspenders: no XMLHttpRequest either
  it('(9) submit handler never calls window.XMLHttpRequest', async () => {
    const xhrSpy = vi.spyOn(global, 'XMLHttpRequest');
    const user = userEvent.setup();
    render(<NewsletterCTA {...defaultProps} />);
    await user.type(screen.getByRole('textbox'), 'user@example.com');
    await user.click(screen.getByRole('button', { name: /Join the manifest/i }));
    expect(xhrSpy).not.toHaveBeenCalled();
    xhrSpy.mockRestore();
  });
});
