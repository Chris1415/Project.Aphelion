import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import PromoBand, { type PromoBandFields } from './PromoBand';
import layout from '../../test/fixtures/group-1-test.layout.json';
import { findRendering, renderComponent } from '../../test/harness';

/** PromoBand — flat (Shape A) CLIENT leaf. Real Edge payload from /Group-1-Test. */
const fields = findRendering(layout, 'PromoBand').fields as PromoBandFields;

describe('PromoBand (flat Shape A leaf) — published view', () => {
  it('binds Eyebrow + Heading from the real payload', () => {
    renderComponent(<PromoBand fields={fields} />);
    expect(screen.getByText(fields.Eyebrow!.value as string)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 }).textContent).toContain(
      fields.Heading!.value as string
    );
  });

  it('renders the PromoImage when the field carries a src', () => {
    const { container } = renderComponent(<PromoBand fields={fields} />);
    // fixture PromoImage has a real src → an <img> is emitted
    expect(container.querySelector('img')).toBeTruthy();
  });
});
