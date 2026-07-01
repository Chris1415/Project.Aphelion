/**
 * Testimonials — CONTAINER via INTEGRATED GRAPHQL (resolver-patterns Pattern 3, Shape C).
 * componentName: "Testimonials" (verbatim, ADR-0010).
 *
 * The rendering carries an Integrated GraphQL query (the rendering's "GraphQL Query" /
 * ComponentQuery field) that returns the folder's OWN scalar fields AND its TestimonialCard
 * children, each field as `jsonValue`. `jsonValue` carries the field's editing metadata, so in
 * XM Cloud Pages metadata-edit-mode BOTH the section heading AND every card field render
 * INLINE-EDITABLE through the SDK field helpers — without making each card a placed rendering.
 *
 * IMPORTANT (resolver-patterns): a Rendering Contents Resolver WINS over the ComponentQuery when
 * both are set. The Children resolver must be CLEARED on this rendering for the query to run.
 *
 * Payload (Shape C — mirrors the query aliases):
 *   fields.data.datasource.{heading,eyebrow,headingAccent}.jsonValue            (scalars)
 *   fields.data.datasource.children.results[]
 *      .{quote,author,role,avatar}.jsonValue                                    (per card)
 *
 * Server component. Editing derived from heading.jsonValue.metadata (present only in edit mode).
 *
 * SDK shapes (verified against sites/aphelion/node_modules):
 *   TextField  react/types/components/Text.d.ts:8   (extends FieldMetadata → .metadata)
 *   ImageField react/types/components/Image.d.ts:17
 */

import { JSX } from 'react';
import { Text, Image } from '@sitecore-content-sdk/nextjs';
import type { TextField, ImageField } from '@sitecore-content-sdk/nextjs';
import type { ComponentRendering, ComponentParams } from '@sitecore-content-sdk/nextjs';
import { EditingEmpty } from 'lib/editing-empty';

/** `field(name:"X") { jsonValue }` → { jsonValue: <field object> } */
interface Gql<T> {
  jsonValue?: T;
}

interface TestimonialCardResult {
  id?: string;
  name?: string;
  quote?: Gql<TextField>;
  author?: Gql<TextField>;
  role?: Gql<TextField>;
  avatar?: Gql<ImageField>;
}

interface TestimonialsDatasource {
  heading?: Gql<TextField>;
  eyebrow?: Gql<TextField>;
  headingAccent?: Gql<TextField>;
  children?: { results?: TestimonialCardResult[] };
}

export interface TestimonialsFields {
  data?: { datasource?: TestimonialsDatasource };
}

export interface TestimonialsProps {
  rendering: ComponentRendering & { fields?: TestimonialsFields };
  fields?: TestimonialsFields;
  params?: ComponentParams;
}

/** Inline card — fields rendered via SDK helpers off jsonValue → inline-editable in Pages. */
function TestimonialCard({
  item,
  isEditing,
}: {
  item: TestimonialCardResult;
  isEditing: boolean;
}): JSX.Element {
  const avatar = item.avatar?.jsonValue;
  const hasImage = !!avatar?.value?.src;

  return (
    <article className="card quote-card" data-reveal="">
      <blockquote>
        <Text field={item.quote?.jsonValue} />
      </blockquote>
      <div className="quote-author">
        {(isEditing || hasImage) && avatar ? (
          <Image field={avatar} className="quote-avatar" aria-hidden="true" />
        ) : (
          <span className="quote-avatar" aria-hidden="true" />
        )}
        <div>
          <div className="name">
            <Text field={item.author?.jsonValue} />
          </div>
          <div className="role">
            <Text field={item.role?.jsonValue} />
          </div>
        </div>
      </div>
    </article>
  );
}

const Testimonials = ({ fields }: TestimonialsProps): JSX.Element => {
  const ds = fields?.data?.datasource;
  // Edit mode: jsonValue carries metadata only in Pages edit/preview.
  const isEditing = !!ds?.heading?.jsonValue?.metadata;
  const cards = ds?.children?.results ?? [];

  return (
    <section className="band atmos" aria-labelledby="test-h">
      <div className="wrap">
        <div className="section-head" data-reveal="">
          {(isEditing || ds?.eyebrow?.jsonValue?.value) && (
            <span className="eyebrow">
              <Text field={ds?.eyebrow?.jsonValue} />
            </span>
          )}
          <h2 id="test-h">
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
        {isEditing && cards.length === 0 ? (
          <EditingEmpty component="Testimonials" child="TestimonialCard" />
        ) : (
          <div className="grid grid-3">
            {cards.map((card, i) => (
              <TestimonialCard key={card.id || i} item={card} isEditing={isEditing} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
