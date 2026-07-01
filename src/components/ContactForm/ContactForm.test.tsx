import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import ContactForm, { type ContactFormFields } from './ContactForm';
import layout from '../../test/fixtures/group-1-test.layout.json';
import { findRendering, renderComponent } from '../../test/harness';

/** ContactForm — flat (Shape A) CLIENT leaf, presentational form (ADR-0006). */
const fields = findRendering(layout, 'ContactForm').fields as ContactFormFields;

describe('ContactForm (flat Shape A leaf) — published view', () => {
  it('binds FormHeading + Intro + NameLabel from the real payload', () => {
    renderComponent(<ContactForm fields={fields} />);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toContain(
      fields.FormHeading!.value as string
    );
    expect(screen.getByText(fields.Intro!.value as string)).toBeInTheDocument();
    expect(screen.getByText(fields.NameLabel!.value as string)).toBeInTheDocument();
  });

  it('renders name + email + message inputs and a submit button', () => {
    const { container } = renderComponent(<ContactForm fields={fields} />);
    expect(container.querySelector('input[name="name"]')).toBeTruthy();
    expect(container.querySelector('input[type="email"]')).toBeTruthy();
    expect(container.querySelector('textarea[name="message"]')).toBeTruthy();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
