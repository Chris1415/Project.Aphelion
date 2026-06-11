/**
 * Testimonials — container component (ADR-0005 rule 2: folder-of-children).
 * Named "Mission Log" in the POC.
 * Props: heading/eyebrow/headingAccent → folder scalars; items array → child items.
 *
 * Mirrors pocs/poc-v5b-prd000/index.html § testimonials.
 */

import { TestimonialCard } from '@/components/TestimonialCard';
import type { TestimonialsProps } from '@/content/home';

export function Testimonials({ heading, eyebrow, headingAccent, items }: TestimonialsProps) {
  return (
    <section className="band atmos" aria-labelledby="test-h">
      <div className="wrap">
        <div className="section-head" data-reveal="">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2 id="test-h">
            {heading}{' '}
            {headingAccent && <span className="kinetic">{headingAccent}</span>}
          </h2>
        </div>
        <div className="grid grid-3">
          {items.map((item) => (
            <TestimonialCard key={item.author} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
