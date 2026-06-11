/**
 * ValueProps — container component (ADR-0005 rule 2: folder-of-children).
 * Props: heading/eyebrow/headingAccent → folder scalars; items array → child items.
 * Renders the "Why Aphelion" band.
 *
 * Mirrors pocs/poc-v5b-prd000/index.html § valueprops.
 */

import { ValueCard } from '@/components/ValueCard';
import type { ValuePropsProps } from '@/content/home';

export function ValueProps({ heading, eyebrow, headingAccent, items }: ValuePropsProps) {
  return (
    <section className="band atmos" aria-labelledby="vp-h">
      <div className="mesh" aria-hidden="true" />
      <div className="wrap">
        <div className="section-head" data-reveal="">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2 id="vp-h">
            {heading}{' '}
            {headingAccent && <span className="kinetic">{headingAccent}</span>}
          </h2>
        </div>
        <div className="grid grid-3">
          {items.map((item) => (
            <ValueCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
