/**
 * ExperienceShowcase — container component (ADR-0005 rule 2: folder-of-children).
 * Props: heading/eyebrow/headingAccent → folder scalars; items array → child items.
 * Alternating layout via CSS :nth-child(even) order swap (from POC globals.css).
 *
 * Mirrors pocs/poc-v5b-prd000/index.html § experiences.
 */

import { ExperienceItem } from '@/components/ExperienceItem';
import type { ExperienceShowcaseProps } from '@/content/home';

export function ExperienceShowcase({ heading, eyebrow, headingAccent, items }: ExperienceShowcaseProps) {
  return (
    <section className="band atmos" id="experiences" aria-labelledby="exp-h">
      <div className="mesh" aria-hidden="true" />
      <div className="wrap">
        <div className="section-head" data-reveal="">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2 id="exp-h">
            {heading}{' '}
            {headingAccent && <span className="kinetic">{headingAccent}</span>}
          </h2>
        </div>
        {items.map((item) => (
          <ExperienceItem key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}
