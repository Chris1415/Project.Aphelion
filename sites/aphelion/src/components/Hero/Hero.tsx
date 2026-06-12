'use client';

/**
 * Hero — SDK field-driven leaf component (Client map — gooey/magnetic require client).
 * ADR-0005 Shape A: flat datasource fields.
 * Field names: Eyebrow, Title, TitleAccent, Lede, PrimaryCta, SecondaryCta,
 *              HeroImage, MetaValue1-3, MetaLabel1-3.
 * componentName: "Hero" (verbatim, ADR-0010).
 *
 * Markup/CSS ported verbatim from static/src/components/Hero/index.tsx.
 * Plain props replaced with SDK field components per port transform (§ 4c).
 * Defensive optional-chaining on all fields (empty-state: Image {value:{}}, Link {value:{href:''}}).
 *
 * SDK shapes (verified at T003 against sites/aphelion/node_modules):
 *   TextField    node_modules/@sitecore-content-sdk/react/types/components/Text.d.ts:8
 *   ImageField   node_modules/@sitecore-content-sdk/react/types/components/Image.d.ts:17
 *   LinkField    node_modules/@sitecore-content-sdk/react/types/components/Link.d.ts:24
 */

import { JSX } from 'react';
import { Text, Image, Link } from '@sitecore-content-sdk/nextjs';
import type { TextField, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { ComponentRendering, ComponentParams } from '@sitecore-content-sdk/nextjs';
import { useMagnetic } from 'lib/motion';

export interface HeroFields {
  Eyebrow?: TextField;
  Title?: TextField;
  TitleAccent?: TextField;
  Lede?: TextField;
  PrimaryCta?: LinkField;
  SecondaryCta?: LinkField;
  HeroImage?: ImageField;
  MetaValue1?: TextField;
  MetaValue2?: TextField;
  MetaValue3?: TextField;
  MetaLabel1?: TextField;
  MetaLabel2?: TextField;
  MetaLabel3?: TextField;
}

export interface HeroProps {
  rendering: ComponentRendering & { fields?: HeroFields };
  fields?: HeroFields;
  params?: ComponentParams;
}

const Hero = ({ fields }: HeroProps): JSX.Element => {
  const { ref: primaryRef } = useMagnetic<HTMLAnchorElement>(0.35);
  const { ref: secondaryRef } = useMagnetic<HTMLAnchorElement>(0.25);

  // Defensive empty-state for Link fields (renders nothing when href is empty)
  const primaryHref = fields?.PrimaryCta?.value?.href;
  const secondaryHref = fields?.SecondaryCta?.value?.href;

  // Build meta rows from flat MetaValue1-3 / MetaLabel1-3 fields
  const metaPairs = [
    { value: fields?.MetaValue1, label: fields?.MetaLabel1 },
    { value: fields?.MetaValue2, label: fields?.MetaLabel2 },
    { value: fields?.MetaValue3, label: fields?.MetaLabel3 },
  ].filter(({ value }) => value?.value);

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
          <span className="eyebrow">
            <Text field={fields?.Eyebrow} />
          </span>
          <h1 id="hero-h">
            <Text field={fields?.Title} />
            <br />
            <span className="kinetic">
              <Text field={fields?.TitleAccent} />
            </span>
          </h1>
          <p className="lede">
            <Text field={fields?.Lede} />
          </p>
          <div className="hero-cta">
            {primaryHref && (
              <Link
                ref={primaryRef}
                field={fields!.PrimaryCta!}
                className="btn btn-primary"
                data-magnetic="0.35"
              />
            )}
            {secondaryHref && (
              <Link
                ref={secondaryRef}
                field={fields!.SecondaryCta!}
                className="btn btn-ghost"
                data-magnetic="0.25"
              />
            )}
          </div>
          {metaPairs.length > 0 && (
            <div className="hero-meta">
              {metaPairs.map((m, i) => (
                <div key={i}>
                  <div className="v">
                    <Text field={m.value} />
                  </div>
                  <div className="l">
                    <Text field={m.label} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Art frame: morphing hero image + CSS mesh fallback */}
        <div className="hero-art">
          <div className="art-mesh" aria-hidden="true" />
          {/* Defensive: Image renders nothing when value.src is empty */}
          <Image
            field={fields?.HeroImage}
            data-fallback=""
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
