/**
 * PageHero — leaf component (ADR-0005 rule 1: one flat Props object).
 * Inner-page header: compact, reuses hero token language (kinetic title, optional art frame).
 * Portability contract: title → Single-Line, subtitle → Rich Text, image → Image field.
 *
 * No POC frame for inner routes — built from shared tokens/classes so it reads as the same family.
 * - .kinetic accent on title (last word wrapped in span)
 * - Optional .hero-art / .art-mesh backdrop when image supplied
 * - Reveal-on-scroll via data-reveal attribute (CSS-driven with useReveal in container if needed)
 */

import type { ImageField } from '@/content/home';

export interface PageHeroProps {
  title: string;
  subtitle: string;
  image?: ImageField;
}

export function PageHero({ title, subtitle, image }: PageHeroProps) {
  return (
    <section className="page-hero band" aria-labelledby="page-hero-h">
      <div className="wrap">
        <div className="page-hero-inner">
          {/* Optional art frame */}
          {image ? (
            <div className="hero-art page-hero-art" aria-hidden={!image.alt ? 'true' : undefined}>
              <div className="art-mesh" aria-hidden="true" />
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
          ) : (
            <div className="art-mesh page-hero-mesh" aria-hidden="true" />
          )}

          <div className="page-hero-copy">
            <h1 id="page-hero-h" className="page-hero-title" data-reveal="">
              <span className="kinetic">{title}</span>
            </h1>
            <p className="page-hero-subtitle lede" data-reveal="" data-delay="1">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
