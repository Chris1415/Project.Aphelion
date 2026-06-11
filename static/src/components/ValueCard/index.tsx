'use client';

/**
 * ValueCard — leaf component (ADR-0005 rule 1).
 * Flat props: icon, title, body → each maps to one future Sitecore field.
 * Renders .card.flowborder (animated gradient edge on hover/focus) + .glyph.
 * Magnetic via data-magnetic attribute (useMagnetic applied by parent or inline data-attr).
 *
 * Portability: used both by ValueProps (home) and potentially About page.
 */

import type { ValueCardProps } from '@/content/home';

export function ValueCard({ icon, title, body }: ValueCardProps) {
  return (
    <article className="card flowborder" data-magnetic="0.18" data-reveal="">
      <div className="glyph" aria-hidden="true">
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}
