/**
 * ExperienceShowcase — CONTAINER via INTEGRATED GRAPHQL (resolver-patterns Pattern 3, Shape C).
 * componentName: "ExperienceShowcase" (verbatim, ADR-0010).
 *
 * The rendering carries an Integrated GraphQL query (the rendering's "GraphQL Query" /
 * ComponentQuery field) that returns the folder's OWN scalar fields AND its ExperienceItem
 * children, each field as `jsonValue`. `jsonValue` carries the field's editing metadata, so in
 * XM Cloud Pages metadata-edit-mode BOTH the section heading AND every item field render
 * INLINE-EDITABLE through the SDK field helpers — without making each item a placed rendering.
 *
 * IMPORTANT (resolver-patterns): a Rendering Contents Resolver WINS over the ComponentQuery when
 * both are set. The Children resolver must be CLEARED on this rendering for the query to run.
 *
 * Payload (Shape C — mirrors the query aliases):
 *   fields.data.datasource.{heading,eyebrow,headingAccent}.jsonValue            (scalars)
 *   fields.data.datasource.children.results[]
 *      .{itemTitle,summary,itemImage,duration,cta}.jsonValue                    (per item)
 *
 * Server component. Editing derived from heading.jsonValue.metadata (present only in edit mode).
 *
 * SDK shapes (verified against sites/aphelion/node_modules):
 *   TextField  react/types/components/Text.d.ts:8   (extends FieldMetadata → .metadata)
 *   ImageField react/types/components/Image.d.ts:17
 *   LinkField  react/types/components/Link.d.ts:24
 */

import { JSX } from 'react';
import { Text, Image, Link } from '@sitecore-content-sdk/nextjs';
import type { TextField, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { ComponentRendering, ComponentParams } from '@sitecore-content-sdk/nextjs';

/** `field(name:"X") { jsonValue }` → { jsonValue: <field object> } */
interface Gql<T> {
  jsonValue?: T;
}

interface ExperienceItemResult {
  id?: string;
  name?: string;
  itemTitle?: Gql<TextField>;
  summary?: Gql<TextField>;
  itemImage?: Gql<ImageField>;
  duration?: Gql<TextField>;
  cta?: Gql<LinkField>;
}

interface ExperienceShowcaseDatasource {
  heading?: Gql<TextField>;
  eyebrow?: Gql<TextField>;
  headingAccent?: Gql<TextField>;
  children?: { results?: ExperienceItemResult[] };
}

export interface ExperienceShowcaseFields {
  data?: { datasource?: ExperienceShowcaseDatasource };
}

export interface ExperienceShowcaseProps {
  rendering: ComponentRendering & { fields?: ExperienceShowcaseFields };
  fields?: ExperienceShowcaseFields;
  params?: ComponentParams;
}

/** Inline item — fields rendered via SDK helpers off jsonValue → inline-editable in Pages. */
function ExperienceItem({
  item,
  isEditing,
}: {
  item: ExperienceItemResult;
  isEditing: boolean;
}): JSX.Element {
  const image = item.itemImage?.jsonValue;
  const hasImage = !!image?.value?.src;
  const link = item.cta?.jsonValue;
  const hasLink = !!link?.value?.href;

  return (
    <div className="exp-item" data-reveal="">
      <div className="exp-media">
        <div className="sky" aria-hidden="true" />
        {(isEditing || hasImage) && image && (
          <Image field={image} data-fallback="" loading="lazy" />
        )}
      </div>
      <div className="exp-copy">
        <span className="dur">
          <Text field={item.duration?.jsonValue} />
        </span>
        <h3>
          <Text field={item.itemTitle?.jsonValue} />
        </h3>
        <p>
          <Text field={item.summary?.jsonValue} />
        </p>
        {(isEditing || hasLink) && link && <Link field={link} className="dest-link" />}
      </div>
    </div>
  );
}

const ExperienceShowcase = ({ fields }: ExperienceShowcaseProps): JSX.Element => {
  const ds = fields?.data?.datasource;
  // Edit mode: jsonValue carries metadata only in Pages edit/preview.
  const isEditing = !!ds?.heading?.jsonValue?.metadata;
  const items = ds?.children?.results ?? [];

  return (
    <section className="band atmos" id="experiences" aria-labelledby="exp-h">
      <div className="mesh" aria-hidden="true" />
      <div className="wrap">
        <div className="section-head" data-reveal="">
          {(isEditing || ds?.eyebrow?.jsonValue?.value) && (
            <span className="eyebrow">
              <Text field={ds?.eyebrow?.jsonValue} />
            </span>
          )}
          <h2 id="exp-h">
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
        {items.map((item, i) => (
          <ExperienceItem key={item.id || i} item={item} isEditing={isEditing} />
        ))}
      </div>
    </section>
  );
};

export default ExperienceShowcase;
