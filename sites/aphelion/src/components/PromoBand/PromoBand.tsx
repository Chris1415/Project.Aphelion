'use client';

/**
 * PromoBand — SDK field-driven leaf component (Client map — CSS mesh + magnetic CTA).
 * ADR-0005 Shape A: flat datasource fields.
 * Field names: Eyebrow, Heading, HeadingAccent, Body, Cta, PromoImage (optional).
 * componentName: "PromoBand" (verbatim, ADR-0010).
 *
 * Markup/CSS ported verbatim from static/src/components/PromoBand/index.tsx.
 * PromoImage is optional — Home content leaves it empty; CSS mesh backdrop used.
 * Defensive: empty PromoImage ({value:{}}) renders nothing (no broken img).
 *
 * SDK shapes (verified at T003 against sites/aphelion/node_modules):
 *   TextField    node_modules/@sitecore-content-sdk/react/types/components/Text.d.ts:8
 *   LinkField    node_modules/@sitecore-content-sdk/react/types/components/Link.d.ts:24
 *   ImageField   node_modules/@sitecore-content-sdk/react/types/components/Image.d.ts:17
 */

import { JSX } from 'react';
import { Text, Link, Image } from '@sitecore-content-sdk/nextjs';
import type { TextField, LinkField, ImageField } from '@sitecore-content-sdk/nextjs';
import type { ComponentRendering, ComponentParams } from '@sitecore-content-sdk/nextjs';
import { useMagnetic } from 'lib/motion';

export interface PromoBandFields {
  Eyebrow?: TextField;
  Heading?: TextField;
  HeadingAccent?: TextField;
  Body?: TextField;
  Cta?: LinkField;
  PromoImage?: ImageField;
}

export interface PromoBandProps {
  rendering: ComponentRendering & { fields?: PromoBandFields };
  fields?: PromoBandFields;
  params?: ComponentParams;
}

const PromoBand = ({ fields }: PromoBandProps): JSX.Element => {
  const { ref: ctaRef } = useMagnetic<HTMLAnchorElement>(0.35);

  // Defensive: only render CTA link when href is populated
  const ctaHref = fields?.Cta?.value?.href;
  // Defensive: only render image when src is populated
  const hasImage = !!(fields?.PromoImage?.value?.src);

  return (
    <section className="band" aria-labelledby="promo-h">
      <div className="wrap">
        <div className="promo" data-reveal="">
          <div className="art-mesh" aria-hidden="true" />
          {hasImage && (
            <Image
              field={fields!.PromoImage!}
              className="promo-image"
              loading="lazy"
            />
          )}
          <div className="promo-inner">
            <span className="eyebrow">
              <Text field={fields?.Eyebrow} />
            </span>
            <h2 id="promo-h">
              <Text field={fields?.Heading} />
              {fields?.HeadingAccent?.value && (
                <>
                  {' '}
                  <span className="kinetic">
                    <Text field={fields.HeadingAccent} />
                  </span>
                </>
              )}
            </h2>
            <p>
              <Text field={fields?.Body} />
            </p>
            {ctaHref && (
              <Link
                ref={ctaRef}
                field={fields!.Cta!}
                className="btn btn-primary"
                data-magnetic="0.35"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBand;
