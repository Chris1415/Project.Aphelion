/**
 * ValueProps — CONTAINER component (ADR-0005 Shape B: Children resolver).
 * componentName: "ValueProps" (verbatim, ADR-0010).
 *
 * Datasource = `ValuePropsFolder` (scalar fields Heading/Eyebrow/HeadingAccent)
 * whose children are `ValueCard` items. The Children Rendering Contents Resolver
 * delivers the children as `fields.items` — Shape B per custom_content-sdk-resolver-patterns:
 *   fields.items: Array<{ id, url, name, fields: <ValueCardFields> }>
 *
 * Per resolver-patterns rule, each `items[i].fields` is read MANUALLY (`.value`) — the
 * SDK field components target placed renderings, not resolver-injected child data.
 * The section-head SCALAR fields are the rendering's OWN datasource fields → SDK <Text>.
 *
 * Server component (no hooks): editing mode derived from the Heading field's metadata.
 *
 * SDK shapes (verified against sites/aphelion/node_modules):
 *   TextField  react/types/components/Text.d.ts:8
 */

import { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentRendering, ComponentParams } from '@sitecore-content-sdk/nextjs';

/** Per-child field hash — ValueCard template */
interface ValueCardFields {
  Icon?: TextField;
  CardTitle?: TextField;
  Body?: TextField;
}

/** Children-resolver item wrapper (Shape B) */
interface ChildItem {
  id: string;
  url?: string;
  name?: string;
  fields: ValueCardFields;
}

/** ValuePropsFolder scalar fields + resolver-injected `items` */
export interface ValuePropsFields {
  Heading?: TextField;
  Eyebrow?: TextField;
  HeadingAccent?: TextField;
  items?: ChildItem[];
}

export interface ValuePropsProps {
  rendering: ComponentRendering & { fields?: ValuePropsFields };
  fields?: ValuePropsFields;
  params?: ComponentParams;
}

/** Local presentational card — NOT a registered rendering (inlined to dodge generate-map). */
function ValueCard({ item }: { item: ChildItem }): JSX.Element {
  const f = item.fields;

  return (
    <article className="card flowborder" data-magnetic="0.18" data-reveal="">
      <div className="glyph" aria-hidden="true">
        {f.Icon?.value as string}
      </div>
      <h3>{f.CardTitle?.value as string}</h3>
      <p>{f.Body?.value as string}</p>
    </article>
  );
}

const ValueProps = ({ fields }: ValuePropsProps): JSX.Element => {
  // Server component editing signal: scalar fields carry metadata only in edit/preview.
  const isEditing = !!fields?.Heading?.metadata;

  const items = fields?.items ?? [];

  return (
    <section className="band atmos" aria-labelledby="vp-h">
      <div className="mesh" aria-hidden="true" />
      <div className="wrap">
        <div className="section-head" data-reveal="">
          {(isEditing || fields?.Eyebrow?.value) && (
            <span className="eyebrow">
              <Text field={fields?.Eyebrow} />
            </span>
          )}
          <h2 id="vp-h">
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
            <ValueCard key={card.id || (card.fields.CardTitle?.value as string)} item={card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProps;
