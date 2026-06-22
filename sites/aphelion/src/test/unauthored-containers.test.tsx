import { describe, it, expect } from 'vitest';
import { renderComponent } from './harness';
import ExperienceShowcase, {
  type ExperienceShowcaseFields,
} from '../components/ExperienceShowcase/ExperienceShowcase';
import Testimonials, { type TestimonialsFields } from '../components/Testimonials/Testimonials';
import ContactDetails, { type ContactDetailsFields } from '../components/ContactDetails/ContactDetails';
import Marquee, { type MarqueeFields } from '../components/Marquee/Marquee';

/**
 * ExperienceShowcase / Testimonials / ContactDetails / Marquee are not yet
 * authored on any live page, so there's no real fixture to bind against. Until
 * there is, these guard EMPTY-STATE resilience: each integrated-GraphQL
 * container must render its section with zero children without crashing
 * (content-resilience contract). Replace with real fixture-backed assertions
 * once the containers are authored + recaptured.
 */
const emptyChildren = { data: { datasource: { children: { results: [] } } } };

describe('Unauthored containers — empty-state resilience (awaiting real content)', () => {
  it('ExperienceShowcase renders its section with zero children', () => {
    const { container } = renderComponent(
      <ExperienceShowcase fields={emptyChildren as ExperienceShowcaseFields} />
    );
    expect(container.querySelector('section')).toBeTruthy();
  });

  it('Testimonials renders its section with zero children', () => {
    const { container } = renderComponent(
      <Testimonials fields={emptyChildren as TestimonialsFields} />
    );
    expect(container.querySelector('section')).toBeTruthy();
  });

  it('ContactDetails renders its section with zero children', () => {
    const { container } = renderComponent(
      <ContactDetails fields={emptyChildren as ContactDetailsFields} />
    );
    expect(container.querySelector('section')).toBeTruthy();
  });

  it('Marquee renders with zero children', () => {
    const { container } = renderComponent(<Marquee fields={emptyChildren as MarqueeFields} />);
    expect(container.firstChild).toBeTruthy();
  });
});
