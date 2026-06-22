import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import PageHero, { type PageHeroFields } from './PageHero';
import layout from '../../test/fixtures/group-1-test.layout.json';
import { findRendering, renderComponent } from '../../test/harness';

/** PageHero — flat (Shape A) SERVER leaf (editing derived from field metadata). */
const fields = findRendering(layout, 'PageHero').fields as PageHeroFields;

describe('PageHero (flat Shape A leaf) — published view', () => {
  it('binds Title + Subtitle from the real payload', () => {
    renderComponent(<PageHero fields={fields} />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      fields.Title!.value as string
    );
    expect(screen.getByText(fields.Subtitle!.value as string)).toBeInTheDocument();
  });

  it('omits the art frame image when HeroImage is empty', () => {
    // fixture HeroImage = {} → no src → fallback mesh, no <img>
    const { container } = renderComponent(<PageHero fields={fields} />);
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('.page-hero-mesh')).toBeTruthy();
  });
});
