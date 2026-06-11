'use client';

/**
 * PromoBand — leaf component (ADR-0005 rule 1).
 * Flat props: eyebrow, heading, headingAccent, body, cta, image? → each maps to one Sitecore field.
 * Renders .promo panel with .art-mesh backdrop, .kinetic accent + magnetic CTA.
 * Image is optional — POC uses CSS .art-mesh only.
 *
 * Mirrors pocs/poc-v5b-prd000/index.html § promo.
 */

import Link from 'next/link';
import { useMagnetic } from '@/lib/motion';
import type { PromoBandProps } from '@/content/home';

export function PromoBand({ eyebrow, heading, headingAccent, body, cta }: PromoBandProps) {
  const { ref: ctaRef } = useMagnetic<HTMLAnchorElement>(0.35);

  return (
    <section className="band" aria-labelledby="promo-h">
      <div className="wrap">
        <div className="promo" data-reveal="">
          <div className="art-mesh" aria-hidden="true" />
          <div className="promo-inner">
            <span className="eyebrow">{eyebrow}</span>
            <h2 id="promo-h">
              {heading}{' '}
              {headingAccent && <span className="kinetic">{headingAccent}</span>}
            </h2>
            <p>{body}</p>
            <Link
              ref={ctaRef}
              className="btn btn-primary"
              data-magnetic="0.35"
              href={cta.href}
            >
              {cta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
