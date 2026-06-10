'use client';

/**
 * ExperienceItem — leaf component (ADR-0005 rule 1).
 * Flat props: title, summary, image, duration, cta → each maps to one Sitecore field.
 * Renders .exp-item 2-col layout (alternating via CSS nth-child(even) in ExperienceShowcase).
 *
 * Image onerror → data-failed="true" → .sky mesh fallback visible.
 * Mirrors pocs/poc-v5b-prd000/index.html § experiences item.
 */

import Link from 'next/link';
import type { ExperienceItemProps } from '@/content/home';

export function ExperienceItem({ title, summary, image, duration, cta }: ExperienceItemProps) {
  return (
    <div className="exp-item" data-reveal="">
      <div className="exp-media">
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
      <div className="exp-copy">
        <span className="dur">{duration}</span>
        <h3>{title}</h3>
        <p>{summary}</p>
        <Link className="dest-link" href={cta.href}>
          {cta.label}
        </Link>
      </div>
    </div>
  );
}
