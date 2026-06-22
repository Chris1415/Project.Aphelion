/**
 * PageHero — SDK field-driven leaf component (Server map — no hooks).
 * ADR-0005 Shape A: flat datasource fields.
 * Field names: Title, Subtitle, HeroImage (optional).
 * componentName: "PageHero" (verbatim, ADR-0010).
 *
 * Markup/CSS ported verbatim from static/src/components/PageHero/index.tsx.
 * Defensive optional-chaining: HeroImage may be empty on inner routes ({value:{}}).
 *
 * SDK shapes (verified at T003 against sites/aphelion/node_modules):
 *   TextField    node_modules/@sitecore-content-sdk/react/types/components/Text.d.ts:8
 *   ImageField   node_modules/@sitecore-content-sdk/react/types/components/Image.d.ts:17
 */

import { JSX } from 'react';
import { Text, Image } from '@sitecore-content-sdk/nextjs';
import type { TextField, ImageField } from '@sitecore-content-sdk/nextjs';
import type { ComponentRendering, ComponentParams } from '@sitecore-content-sdk/nextjs';

export interface PageHeroFields {
  Title?: TextField;
  Subtitle?: TextField;
  HeroImage?: ImageField;
}

export interface PageHeroProps {
  rendering: ComponentRendering & { fields?: PageHeroFields };
  fields?: PageHeroFields;
  params?: ComponentParams;
}

const PageHero = ({ fields }: PageHeroProps): JSX.Element => {
  // Server component (no useSitecore hook): derive editing mode from field metadata,
  // which Sitecore only emits in Pages edit/preview. In editing we render the art frame
  // even when HeroImage is empty so the SDK shows its editable image placeholder.
  const isEditing = !!fields?.Title?.metadata;
  // Defensive: only render art frame when HeroImage has a src value
  const hasImage = !!(fields?.HeroImage?.value?.src);
  const showArt = !!fields?.HeroImage && (isEditing || hasImage);

  return (
    <section className="page-hero band" aria-labelledby="page-hero-h">
      <div className="wrap">
        <div className="page-hero-inner">
          {/* Optional art frame */}
          {showArt ? (
            <div className="hero-art page-hero-art" aria-hidden="true">
              <div className="art-mesh" aria-hidden="true" />
              <Image
                field={fields!.HeroImage!}
                data-fallback=""
                loading="lazy"
              />
            </div>
          ) : (
            <div className="art-mesh page-hero-mesh" aria-hidden="true" />
          )}

          <div className="page-hero-copy">
            <h1 id="page-hero-h" className="page-hero-title" data-reveal="">
              <span className="kinetic">
                <Text field={fields?.Title} />
              </span>
            </h1>
            <p className="page-hero-subtitle lede" data-reveal="" data-delay="1">
              <Text field={fields?.Subtitle} />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageHero;
