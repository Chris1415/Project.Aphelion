import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import Promo, { type PromoFields } from './Promo';
import layout from '../../test/fixtures/group-1-test.layout.json';
import { findRendering, renderComponent } from '../../test/harness';

/**
 * Promo — flat datasource (Shape A) leaf, CLIENT component (useSitecore mocked
 * to published view in tests/setup.ts). Asserts the SDK field-binding layer
 * against the REAL Edge payload captured from /Group-1-Test.
 */
const fields = findRendering(layout, 'Promo').fields as PromoFields;

describe('Promo (flat Shape A leaf) — published view', () => {
  it('binds Eyebrow + Lede + Title Text fields from the real Edge payload', () => {
    renderComponent(<Promo fields={fields} />);
    expect(screen.getByText(fields.Eyebrow!.value as string)).toBeInTheDocument();
    expect(screen.getByText(fields.Lede!.value as string)).toBeInTheDocument();
    // Title shares the <h1> with <br> + TitleAccent, so assert containment.
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      fields.Title!.value as string
    );
  });

  it('renders the hero section landmark', () => {
    const { container } = renderComponent(<Promo fields={fields} />);
    expect(container.querySelector('section.hero')).toBeTruthy();
  });

  it('renders SecondaryCta (real href) and omits empty-href PrimaryCta', () => {
    renderComponent(<Promo fields={fields} />);
    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'));
    expect(hrefs).toContain(fields.SecondaryCta!.value!.href); // http://www.google.de
    expect(hrefs).not.toContain(''); // PrimaryCta href '' → not rendered
  });
});
