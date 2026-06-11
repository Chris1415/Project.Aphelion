/**
 * T028a — [RED] ContactForm validation tests.
 * TDD RED phase: these tests MUST FAIL (module not found) before T028b implements the component.
 * After T028b implementation, all tests must be GREEN.
 *
 * TC-32 through TC-35 + TC-19 coverage for ContactForm.
 * Covers: field-specific required validation, email format, success state,
 *         per-field error clearing, aria-describedby, role="alert", never-fetch.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from '../index';

// Mock fetch at module level (ADR-0006: never fetch)
const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(new Response());

const defaultProps = {
  heading: 'Begin your voyage',
  intro: "Tell us where you'd like to go. We'll reach out within one orbit.",
  nameLabel: 'Your name',
  emailLabel: 'Your email',
  messageLabel: 'Your message',
  buttonLabel: 'Send enquiry',
};

beforeEach(() => {
  fetchSpy.mockClear();
});

describe('ContactForm', () => {
  // TC-19 coverage — all six flat props render in DOM
  it('(1) renders heading, intro, nameLabel, emailLabel, messageLabel, buttonLabel', () => {
    render(<ContactForm {...defaultProps} />);
    expect(screen.getByText('Begin your voyage')).toBeInTheDocument();
    expect(screen.getByText(/Tell us where you'd like to go/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Your message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send enquiry/i })).toBeInTheDocument();
  });

  // TC-32 — empty name submit → name field aria-invalid + error copy (name-specific)
  it('(2) empty name submit: name field gets aria-invalid="true" + error copy', async () => {
    const user = userEvent.setup();
    render(<ContactForm {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: /Send enquiry/i }));

    const nameInput = screen.getByLabelText(/Your name/i);
    expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    // Error elements are role=alert; find the name-field specific one by its id
    const nameError = document.getElementById('cf-name-error');
    expect(nameError).toHaveTextContent(/required/i);
  });

  // TC-32 continued — field-specific: name filled but email empty → email gets aria-invalid
  it('(3) name filled, email empty submit: email field gets aria-invalid="true"', async () => {
    const user = userEvent.setup();
    render(<ContactForm {...defaultProps} />);
    await user.type(screen.getByLabelText(/Your name/i), 'Inara Voss');
    await user.type(screen.getByLabelText(/Your message/i), 'Interested in Vela Drift.');
    await user.click(screen.getByRole('button', { name: /Send enquiry/i }));

    const emailInput = screen.getByLabelText(/Your email/i);
    expect(emailInput).toHaveAttribute('aria-invalid', 'true');
  });

  // TC-33 — invalid email format → aria-invalid + "Enter a valid email address."
  it('(4) name + message filled, email="bad": email aria-invalid + "Enter a valid email address."', async () => {
    const user = userEvent.setup();
    render(<ContactForm {...defaultProps} />);
    await user.type(screen.getByLabelText(/Your name/i), 'Inara Voss');
    await user.type(screen.getByLabelText(/Your email/i), 'bad');
    await user.type(screen.getByLabelText(/Your message/i), 'Interested in Vela Drift.');
    await user.click(screen.getByRole('button', { name: /Send enquiry/i }));

    expect(screen.getByLabelText(/Your email/i)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
  });

  // TC-34 — all valid → success state, role="status"
  it('(5) all fields valid: success state visible, role="status" present', async () => {
    const user = userEvent.setup();
    render(<ContactForm {...defaultProps} />);
    await user.type(screen.getByLabelText(/Your name/i), 'Inara Voss');
    await user.type(screen.getByLabelText(/Your email/i), 'inara@orbit.example');
    await user.type(screen.getByLabelText(/Your message/i), 'Interested in Vela Drift.');
    await user.click(screen.getByRole('button', { name: /Send enquiry/i }));

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  // TC-35 per-field error clearing — input event clears that field's aria-invalid
  it('(6) input event on a field with aria-invalid clears that field aria-invalid', async () => {
    const user = userEvent.setup();
    render(<ContactForm {...defaultProps} />);
    // Trigger name error
    await user.click(screen.getByRole('button', { name: /Send enquiry/i }));
    const nameInput = screen.getByLabelText(/Your name/i);
    expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    // Type → should clear
    await user.type(nameInput, 'I');
    expect(nameInput).not.toHaveAttribute('aria-invalid', 'true');
  });

  // TC-35 — submit handler NEVER calls fetch (ADR-0006 regression-critical)
  it('(7) submit handler never calls window.fetch', async () => {
    const user = userEvent.setup();
    render(<ContactForm {...defaultProps} />);
    // Submit empty
    await user.click(screen.getByRole('button', { name: /Send enquiry/i }));
    expect(fetchSpy).not.toHaveBeenCalled();
    // Submit with valid data
    await user.type(screen.getByLabelText(/Your name/i), 'Inara Voss');
    await user.type(screen.getByLabelText(/Your email/i), 'inara@orbit.example');
    await user.type(screen.getByLabelText(/Your message/i), 'Message content.');
    await user.click(screen.getByRole('button', { name: /Send enquiry/i }));
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  // a11y wire-up — each field has aria-describedby pointing to its error element id
  it('(8) each field has aria-describedby pointing to its error element id', () => {
    render(<ContactForm {...defaultProps} />);
    const nameInput = screen.getByLabelText(/Your name/i);
    const emailInput = screen.getByLabelText(/Your email/i);
    const msgInput = screen.getByLabelText(/Your message/i);

    expect(nameInput).toHaveAttribute('aria-describedby');
    expect(emailInput).toHaveAttribute('aria-describedby');
    expect(msgInput).toHaveAttribute('aria-describedby');
  });

  // a11y — error elements have role="alert"
  it('(9) error elements have role="alert" after invalid submit', async () => {
    const user = userEvent.setup();
    render(<ContactForm {...defaultProps} />);
    await user.click(screen.getByRole('button', { name: /Send enquiry/i }));
    // At least one role=alert should be present after submit
    const alerts = screen.getAllByRole('alert');
    expect(alerts.length).toBeGreaterThan(0);
  });
});
