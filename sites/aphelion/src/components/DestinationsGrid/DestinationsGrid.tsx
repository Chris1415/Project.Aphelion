/**
 * DestinationsGrid — CONTAINER component (ADR-0005 Shape B: Children resolver).
 * componentName: "DestinationsGrid" (verbatim, ADR-0010).
 *
 * Datasource = `DestinationsGridFolder` (scalar fields Heading/Eyebrow/HeadingAccent/Intro)
 * whose children are `DestinationCard` items. The Children Rendering Contents Resolver
 * ({2F5C334E-5615-423C-8281-9FC180191302}) delivers the children as `fields.items` —
 * Shape B per custom_content-sdk-resolver-patterns:
 *   fields.items: Array<{ id, url, name, displayName, fields: <DestinationCardFields> }>
 *
 * Per resolver-patterns rule, each `items[i].fields` is read MANUALLY (`.value`) — the
 * SDK field components target placed renderings, not resolver-injected child data.
 * The section-head SCALAR fields are the rendering's OWN datasource fields, so they use
 * the SDK <Text> helper (editing-safe gating applied to the optional ones).
 *
 * Server component (no hooks): editing mode derived from the Heading field's metadata.
 *
 * GridLimit (rendering parameter, DestinationsGridParams): 0/absent = all; N = first N.
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

/** Per-child field hash (Shape A inside each Shape-B item) — DestinationCard template */
interface DestinationCardFields {
  Name?: TextField;
  Tagline?: TextField;
  CardImage?: ImageField;
  Distance?: TextField;
  Detail?: TextField;
  CardLink?: LinkField;
}

/** Children-resolver item wrapper (Shape B) */
interface ChildItem {
  id: string;
  url?: string;
  name?: string;
  displayName?: string;
  fields: DestinationCardFields;
}

/** DestinationsGridFolder scalar fields + resolver-injected `items` */
export interface DestinationsGridFields {
  Heading?: TextField;
  Eyebrow?: TextField;
  HeadingAccent?: TextField;
  Intro?: TextField;
  items?: ChildItem[];
}

export interface DestinationsGridProps {
  rendering: ComponentRendering & { fields?: DestinationsGridFields };
  fields?: DestinationsGridFields;
  params?: ComponentParams;
}

/** Local presentational card — NOT a registered rendering (inlined to dodge generate-map). */
function DestinationCard({ item }: { item: ChildItem }): JSX.Element {
  const f = item.fields;
  const src = f.CardImage?.value?.src as string | undefined;
  const alt = (f.CardImage?.value?.alt as string | undefined) ?? '';
  const href = f.CardLink?.value?.href;
  const linkText = f.CardLink?.value?.text || 'Plan this voyage';

  return (
    <article className="card dest-card" data-reveal="">
      <div className="dest-media">
        <div className="sky" aria-hidden="true" />
        {src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img data-fallback="" loading="lazy" src={src} alt={alt} />
        )}
      </div>
      <div className="dest-body">
        <div className="dest-row">
          <h3>{f.Name?.value as string}</h3>
          {f.Distance?.value && <span className="dest-tag">{f.Distance.value as string}</span>}
        </div>
        {f.Detail?.value && <p>{f.Detail.value as string}</p>}
        {href && (
          <a className="dest-link" href={href}>
            {linkText}
          </a>
        )}
      </div>
    </article>
  );
}

const DestinationsGrid = ({ fields, params }: DestinationsGridProps): JSX.Element => {
  // Server component editing signal: scalar fields carry metadata only in edit/preview.
  const isEditing = !!fields?.Heading?.metadata;

  // GridLimit rendering parameter: '0'/absent = all; positive int = first N.
  const rawLimit = params?.GridLimit;
  const limit = rawLimit !== undefined ? parseInt(String(rawLimit), 10) : 0;
  const allItems = fields?.items ?? [];
  const items = Number.isFinite(limit) && limit > 0 ? allItems.slice(0, limit) : allItems;

  return (
    <section className="band atmos" id="destinations" aria-labelledby="dest-h">
      <div className="wrap">
        <div className="section-head" data-reveal="">
          {(isEditing || fields?.Eyebrow?.value) && (
            <span className="eyebrow">
              <Text field={fields?.Eyebrow} />
            </span>
          )}
          <h2 id="dest-h">
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
          {(isEditing || fields?.Intro?.value) && (
            <p>
              <Text field={fields?.Intro} />
            </p>
          )}
        </div>
        <div className="grid grid-3">
          {items.map((item) => (
            <DestinationCard key={item.id || (item.fields.Name?.value as string)} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationsGrid;
