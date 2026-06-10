'use client';

/**
 * DestinationCard — leaf component (ADR-0005 rule 1).
 * Flat props: name, tagline, image, distance, detail, link → each maps to one Sitecore field.
 * Renders .card.dest-card with .dest-media (.sky fallback + lazy image) + .dest-body.
 *
 * Image onerror → data-failed="true" → .sky mesh fallback visible (opacity transition in CSS).
 * Mirrors pocs/poc-v5b-prd000/index.html § destinations card.
 */

import Link from 'next/link';
import type { DestinationCardProps } from '@/content/home';

export function DestinationCard({ name, image, distance, detail, link }: DestinationCardProps) {
  return (
    <article className="card dest-card" data-reveal="">
      <div className="dest-media">
        <div className="sky" aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-fallback=""
          loading="lazy"
          src={image.src}
          alt={image.alt}
          onError={(e) => {
            const img = e.currentTarget;
            img.style.opacity = '0';
            img.setAttribute('data-failed', 'true');
          }}
        />
      </div>
      <div className="dest-body">
        <div className="dest-row">
          <h3>{name}</h3>
          <span className="dest-tag">{distance}</span>
        </div>
        <p>{detail}</p>
        <Link className="dest-link" href={link.href}>
          {link.label}
        </Link>
      </div>
    </article>
  );
}
