/**
 * Testimonials — CONTAINER component (ADR-0005 Shape B: Children resolver).
 * componentName: "Testimonials" (verbatim, ADR-0010).
 *
 * Datasource = `TestimonialsFolder` (scalar fields Heading/Eyebrow/HeadingAccent)
 * whose children are `TestimonialCard` items. The Children Rendering Contents Resolver
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
 */

import { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { TextField, ImageField } from '@sitecore-content-sdk/nextjs';
import type { ComponentRendering, ComponentParams } from '@sitecore-content-sdk/nextjs';

/** Per-child field hash — TestimonialCard template */
interface TestimonialCardFields {
  Quote?: TextField;
  Author?: TextField;
  Role?: TextField;
  Avatar?: ImageField;
}

/** Children-resolver item wrapper (Shape B) */
interface ChildItem {
  id: string;
  url?: string;
  name?: string;
  fields: TestimonialCardFields;
}

/** TestimonialsFolder scalar fields + resolver-injected `items` */
export interface TestimonialsFields {
  Heading?: TextField;
  Eyebrow?: TextField;
  HeadingAccent?: TextField;
  items?: ChildItem[];
}

export interface TestimonialsProps {
  rendering: ComponentRendering & { fields?: TestimonialsFields };
  fields?: TestimonialsFields;
  params?: ComponentParams;
}

/** Local presentational card — NOT a registered rendering (inlined to dodge generate-map). */
function TestimonialCard({ item }: { item: ChildItem }): JSX.Element {
  const f = item.fields;
  const avatarSrc = f.Avatar?.value?.src as string | undefined;
  const avatarAlt = (f.Avatar?.value?.alt as string | undefined) ?? '';

  return (
    <article className="card quote-card" data-reveal="">
      <blockquote>{f.Quote?.value as string}</blockquote>
      <div className="quote-author">
        {avatarSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="quote-avatar"
            src={avatarSrc}
            alt={avatarAlt}
            aria-hidden="true"
          />
        ) : (
          <span className="quote-avatar" aria-hidden="true" />
        )}
        <div>
          <div className="name">{f.Author?.value as string}</div>
          <div className="role">{f.Role?.value as string}</div>
        </div>
      </div>
    </article>
  );
}

const Testimonials = ({ fields }: TestimonialsProps): JSX.Element => {
  // Server component editing signal: scalar fields carry metadata only in edit/preview.
  const isEditing = !!fields?.Heading?.metadata;

  const items = fields?.items ?? [];

  return (
    <section className="band atmos" aria-labelledby="test-h">
      <div className="wrap">
        <div className="section-head" data-reveal="">
          {(isEditing || fields?.Eyebrow?.value) && (
            <span className="eyebrow">
              <Text field={fields?.Eyebrow} />
            </span>
          )}
          <h2 id="test-h">
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
        <div className="grid grid-3">
          {items.map((card) => (
            <TestimonialCard key={card.id || (card.fields.Author?.value as string)} item={card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
