'use client';

/**
 * Hero — leaf component (ADR-0005 rule 1: one flat Props object).
 * Portability contract: every scalar prop → one future Sitecore datasource field.
 *
 * Structure mirrors pocs/poc-v5b-prd000/index.html § hero exactly.
 * - .flux-field 4-blob gooey field (filter:url(#gooey) resolved from root layout SVG)
 * - .stars SVG background decoration
 * - .hero-grid 2-col: copy + .hero-art morphing frame
 * - .kinetic accent span on titleAccent
 * - magnetic CTAs via useMagnetic
 * - Image onerror → data-failed="true" → reveals .art-mesh behind
 */

import Link from 'next/link';
import { useMagnetic } from '@/lib/motion';
import type { HeroProps } from '@/content/home';

export function Hero({
  eyebrow,
  title,
  titleAccent,
  lede,
  primaryCta,
  secondaryCta,
  image,
  meta,
}: HeroProps) {
  const { ref: primaryRef } = useMagnetic<HTMLAnchorElement>(0.35);
  const { ref: secondaryRef } = useMagnetic<HTMLAnchorElement>(0.25);

  return (
    <section className="hero" aria-labelledby="hero-h">
      {/* Gooey morphing blob field (decorative) — filter resolved from #gooey in root layout */}
      <div className="flux-field" aria-hidden="true">
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
        <span className="blob b4" />
      </div>

      {/* Starfield SVG decoration */}
      <svg
        className="stars"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 100 100"
      >
        <g fill="#fff">
          <circle cx="12" cy="18" r="0.3" />
          <circle cx="28" cy="42" r="0.22" />
          <circle cx="62" cy="14" r="0.3" />
          <circle cx="78" cy="36" r="0.25" />
          <circle cx="44" cy="66" r="0.3" />
          <circle cx="88" cy="72" r="0.2" />
          <circle cx="18" cy="84" r="0.28" />
          <circle cx="54" cy="28" r="0.2" />
          <circle cx="70" cy="58" r="0.26" />
        </g>
      </svg>

      <div className="wrap hero-grid">
        {/* Copy column */}
        <div className="hero-copy">
          <span className="eyebrow">{eyebrow}</span>
          <h1 id="hero-h">
            {title}
            <br />
            <span className="kinetic">{titleAccent}</span>
          </h1>
          <p className="lede">{lede}</p>
          <div className="hero-cta">
            <Link
              ref={primaryRef}
              className="btn btn-primary"
              data-magnetic="0.35"
              href={primaryCta.href}
            >
              {primaryCta.label}
            </Link>
            {secondaryCta && (
              <Link
                ref={secondaryRef}
                className="btn btn-ghost"
                data-magnetic="0.25"
                href={secondaryCta.href}
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
          {meta.length > 0 && (
            <div className="hero-meta">
              {meta.map((m) => (
                <div key={m.label}>
                  <div className="v">{m.value}</div>
                  <div className="l">{m.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Art frame: morphing hero image + CSS mesh fallback */}
        <div className="hero-art">
          <div className="art-mesh" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-fallback=""
            loading="eager"
            src={image.src}
            alt={image.alt}
            onError={(e) => {
              const img = e.currentTarget;
              img.style.opacity = '0';
              img.setAttribute('data-failed', 'true');
            }}
          />
        </div>
      </div>
    </section>
  );
}
