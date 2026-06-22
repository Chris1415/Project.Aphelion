import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import NewsletterCTA, { type NewsletterCTAFields } from './NewsletterCTA';
import layout from '../../test/fixtures/group-1-test.layout.json';
import { findRendering, renderComponent } from '../../test/harness';

/** NewsletterCTA — flat (Shape A) CLIENT leaf, presentational form (ADR-0006). */
const fields = findRendering(layout, 'NewsletterCTA').fields as NewsletterCTAFields;

describe('NewsletterCTA (flat Shape A leaf) — published view', () => {
  it('binds Heading + Body from the real payload', () => {
    renderComponent(<NewsletterCTA fields={fields} />);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toContain(
      fields.Heading!.value as string
    );
    expect(screen.getByText(fields.Body!.value as string)).toBeInTheDocument();
  });

  it('renders a presentational email input + submit button (no backend)', () => {
    const { container } = renderComponent(<NewsletterCTA fields={fields} />);
    expect(container.querySelector('input[type="email"]')).toBeTruthy();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
