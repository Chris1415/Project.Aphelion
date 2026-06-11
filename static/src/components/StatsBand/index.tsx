/**
 * StatsBand — container component (ADR-0005 rule 2: folder-of-children).
 * Props: optional heading → folder scalar; items array → child items (each a Stat).
 * .stats-grid: 4-up desktop, 2-up mobile (via CSS in globals.css).
 *
 * Mirrors pocs/poc-v5b-prd000/index.html § stats.
 */

import { Stat } from '@/components/Stat';
import type { StatsBandProps } from '@/content/home';

export function StatsBand({ heading, items }: StatsBandProps) {
  return (
    <section className="band stats-band atmos" aria-labelledby="stats-h">
      <div className="mesh" aria-hidden="true" />
      {heading ? (
        <h2 id="stats-h" className="sr-only">
          {heading}
        </h2>
      ) : (
        <h2 id="stats-h" className="sr-only">
          Aphelion by the numbers
        </h2>
      )}
      <div className="wrap">
        <div className="stats-grid">
          {items.map((item) => (
            <Stat key={item.label} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
