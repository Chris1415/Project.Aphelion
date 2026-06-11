/**
 * DestinationsGrid — container component (ADR-0005 rule 2: folder-of-children).
 * Props: heading/eyebrow/headingAccent/intro → folder scalars; items array → child items.
 * Optional `limit` prop: when supplied, renders only the first `limit` cards.
 *   - Home shows a preview (limit=3 or similar); /destinations page shows the full set.
 *   - Same component, same datasource → limit is a rendering parameter.
 *
 * Mirrors pocs/poc-v5b-prd000/index.html § destinations.
 */

import { DestinationCard } from '@/components/DestinationCard';
import type { DestinationsGridProps } from '@/content/home';

interface Props extends DestinationsGridProps {
  /** Optional: truncate to first N cards (home preview). Rendering parameter — not a datasource field. */
  limit?: number;
}

export function DestinationsGrid({ heading, eyebrow, headingAccent, intro, items, limit }: Props) {
  const displayItems = limit !== undefined ? items.slice(0, limit) : items;

  return (
    <section className="band atmos" id="destinations" aria-labelledby="dest-h">
      <div className="wrap">
        <div className="section-head" data-reveal="">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2 id="dest-h">
            {heading}{' '}
            {headingAccent && <span className="kinetic">{headingAccent}</span>}
          </h2>
          {intro && <p>{intro}</p>}
        </div>
        <div className="grid grid-3">
          {displayItems.map((item) => (
            <DestinationCard key={item.name} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
