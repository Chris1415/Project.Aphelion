/**
 * ExperienceShowcase — CONTAINER component (ADR-0005 Shape B: Children resolver).
 * componentName: "ExperienceShowcase" (verbatim, ADR-0010).
 *
 * Datasource = `ExperienceShowcaseFolder` (scalar fields Heading/Eyebrow/HeadingAccent)
 * whose children are `ExperienceItem` items. The Children Rendering Contents Resolver
 * delivers the children as `fields.items` — Shape B per custom_content-sdk-resolver-patterns.
 *
 * Per resolver-patterns rule, each `items[i].fields` is read MANUALLY (`.value`).
 * The section-head SCALAR fields use SDK <Text> (editing-safe gating on optional ones).
 *
 * Server component (no hooks): editing mode derived from the Heading field's metadata.
 *
 * SDK shapes (verified against sites/aphelion/node_modules):
 *   TextField  react/types/components/Text.d.ts:8
 *   ImageField react/types/components/Image.d.ts:17  (value.src / value.alt)
 *   LinkField  react/types/components/Link.d.ts:24   (value.href / value.text)
 */

import { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { TextField, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { ComponentRendering, ComponentParams } from '@sitecore-content-sdk/nextjs';

/** Per-child field hash — ExperienceItem template */
interface ExperienceItemFields {
  ItemTitle?: TextField;
  Summary?: TextField;
  ItemImage?: ImageField;
  Duration?: TextField;
  Cta?: LinkField;
}

/** Children-resolver item wrapper (Shape B) */
interface ChildItem {
  id: string;
  url?: string;
  name?: string;
  fields: ExperienceItemFields;
}

/** ExperienceShowcaseFolder scalar fields + resolver-injected `items` */
export interface ExperienceShowcaseFields {
  Heading?: TextField;
  Eyebrow?: TextField;
  HeadingAccent?: TextField;
  items?: ChildItem[];
}

export interface ExperienceShowcaseProps {
  rendering: ComponentRendering & { fields?: ExperienceShowcaseFields };
  fields?: ExperienceShowcaseFields;
  params?: ComponentParams;
}

/** Local presentational item — NOT a registered rendering (inlined to dodge generate-map). */
function ExperienceItem({ item }: { item: ChildItem }): JSX.Element {
  const f = item.fields;
  const src = f.ItemImage?.value?.src as string | undefined;
  const alt = (f.ItemImage?.value?.alt as string | undefined) ?? '';
  const href = f.Cta?.value?.href;

  return (
    <div className="exp-item" data-reveal="">
      <div className="exp-media">
        <div className="sky" aria-hidden="true" />
        {src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img data-fallback="" loading="lazy" src={src} alt={alt} />
        )}
      </div>
      <div className="exp-copy">
        <span className="dur">{f.Duration?.value as string}</span>
        <h3>{f.ItemTitle?.value as string}</h3>
        <p>{f.Summary?.value as string}</p>
        {href && (
          <a className="dest-link" href={href}>
            {(f.Cta?.value?.text as string) || 'Learn more'}
          </a>
        )}
      </div>
    </div>
  );
}

const ExperienceShowcase = ({ fields }: ExperienceShowcaseProps): JSX.Element => {
  // Server component editing signal: scalar fields carry metadata only in edit/preview.
  const isEditing = !!fields?.Heading?.metadata;

  const items = fields?.items ?? [];

  return (
    <section className="band atmos" id="experiences" aria-labelledby="exp-h">
      <div className="mesh" aria-hidden="true" />
      <div className="wrap">
        <div className="section-head" data-reveal="">
          {(isEditing || fields?.Eyebrow?.value) && (
            <span className="eyebrow">
              <Text field={fields?.Eyebrow} />
            </span>
          )}
          <h2 id="exp-h">
            <Text field={fields?.Heading} />
            {(isEditing || fields?.HeadingAccent?.value) && (
              <>
                {' '}
                <span className="kinetic">
                  <Text field={fields?.HeadingAccent} />
                </span>
              </>
            )}
          </h2>
        </div>
        {items.map((item) => (
          <ExperienceItem key={item.id || (item.fields.ItemTitle?.value as string)} item={item} />
        ))}
      </div>
    </section>
  );
};

export default ExperienceShowcase;
