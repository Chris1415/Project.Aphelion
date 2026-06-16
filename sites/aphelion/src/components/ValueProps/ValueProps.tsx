/**
 * ValueProps — CONTAINER via INTEGRATED GRAPHQL (resolver-patterns Pattern 3, Shape C).
 * componentName: "ValueProps" (verbatim, ADR-0010).
 *
 * The rendering carries an Integrated GraphQL query (the rendering's "GraphQL Query" /
 * ComponentQuery field) that returns the folder's OWN scalar fields AND its ValueCard children,
 * each field as `jsonValue`. `jsonValue` carries the field's editing metadata, so in XM Cloud
 * Pages metadata-edit-mode BOTH the section heading AND every card field render INLINE-EDITABLE
 * through the SDK field helpers — without making each card a placed rendering.
 *
 * IMPORTANT (resolver-patterns): a Rendering Contents Resolver WINS over the ComponentQuery when
 * both are set. The Children resolver must be CLEARED on this rendering for the query to run.
 *
 * Payload (Shape C — mirrors the query aliases):
 *   fields.data.datasource.{heading,eyebrow,headingAccent}.jsonValue            (scalars)
 *   fields.data.datasource.children.results[]
 *      .{icon,cardTitle,body}.jsonValue                                          (per card)
 *
 * Server component. Editing derived from heading.jsonValue.metadata (present only in edit mode).
 *
 * SDK shapes (verified against sites/aphelion/node_modules):
 *   TextField  react/types/components/Text.d.ts:8   (extends FieldMetadata → .metadata)
 */

import { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentRendering, ComponentParams } from '@sitecore-content-sdk/nextjs';

/** `field(name:"X") { jsonValue }` → { jsonValue: <field object> } */
interface Gql<T> {
  jsonValue?: T;
}

interface ValueCardResult {
  id?: string;
  name?: string;
  icon?: Gql<TextField>;
  cardTitle?: Gql<TextField>;
  body?: Gql<TextField>;
}

interface ValuePropsDatasource {
  heading?: Gql<TextField>;
  eyebrow?: Gql<TextField>;
  headingAccent?: Gql<TextField>;
  children?: { results?: ValueCardResult[] };
}

export interface ValuePropsFields {
  data?: { datasource?: ValuePropsDatasource };
}

export interface ValuePropsProps {
  rendering: ComponentRendering & { fields?: ValuePropsFields };
  fields?: ValuePropsFields;
  params?: ComponentParams;
}

/** Inline card — fields rendered via SDK helpers off jsonValue → inline-editable in Pages. */
function ValueCard({
  item,
}: {
  item: ValueCardResult;
  isEditing: boolean;
}): JSX.Element {
  return (
    <article className="card flowborder" data-magnetic="0.18" data-reveal="">
      <div className="glyph" aria-hidden="true">
        <Text field={item.icon?.jsonValue} />
      </div>
      <h3>
        <Text field={item.cardTitle?.jsonValue} />
      </h3>
      <p>
        <Text field={item.body?.jsonValue} />
      </p>
    </article>
  );
}

const ValueProps = ({ fields }: ValuePropsProps): JSX.Element => {
  const ds = fields?.data?.datasource;
  // Edit mode: jsonValue carries metadata only in Pages edit/preview.
  const isEditing = !!ds?.heading?.jsonValue?.metadata;
  const cards = ds?.children?.results ?? [];

  return (
    <section className="band atmos" aria-labelledby="vp-h">
      <div className="mesh" aria-hidden="true" />
      <div className="wrap">
        <div className="section-head" data-reveal="">
          {(isEditing || ds?.eyebrow?.jsonValue?.value) && (
            <span className="eyebrow">
              <Text field={ds?.eyebrow?.jsonValue} />
            </span>
          )}
          <h2 id="vp-h">
            <Text field={ds?.heading?.jsonValue} />
            {(isEditing || ds?.headingAccent?.jsonValue?.value) && (
              <>
                {' '}
                <span className="kinetic">
                  <Text field={ds?.headingAccent?.jsonValue} />
                </span>
              </>
            )}
          </h2>
        </div>
        <div className="grid grid-3">
          {cards.map((card, i) => (
            <ValueCard key={card.id || i} item={card} isEditing={isEditing} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProps;
