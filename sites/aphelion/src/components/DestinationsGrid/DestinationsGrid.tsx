/**
 * DestinationsGrid — CONTAINER via INTEGRATED GRAPHQL (resolver-patterns Pattern 3, Shape C).
 * componentName: "DestinationsGrid" (verbatim, ADR-0010).
 *
 * The rendering carries an Integrated GraphQL query (the rendering's "GraphQL Query" /
 * ComponentQuery field) that returns the folder's OWN fields AND its DestinationCard children,
 * each field as `jsonValue`. `jsonValue` carries the field's editing metadata, so in XM Cloud
 * Pages metadata-edit-mode BOTH the section heading AND every card field render INLINE-EDITABLE
 * through the SDK field helpers — without making each card a placed rendering.
 *
 * IMPORTANT (resolver-patterns): a Rendering Contents Resolver WINS over the ComponentQuery when
 * both are set. The Children resolver must be CLEARED on this rendering for the query to run.
 *
 * Payload (Shape C — mirrors the query aliases):
 *   fields.data.datasource.{heading,eyebrow,headingAccent,intro}.jsonValue            (scalars)
 *   fields.data.datasource.children.results[]
 *      .{cardName,tagline,distance,detail,cardImage,cardLink}.jsonValue                (per card)
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
import { EditingEmpty } from 'lib/editing-empty';

/** `field(name:"X") { jsonValue }` → { jsonValue: <field object> } */
interface Gql<T> {
  jsonValue?: T;
}

interface DestinationCardResult {
  id?: string;
  name?: string;
  cardName?: Gql<TextField>;
  tagline?: Gql<TextField>;
  distance?: Gql<TextField>;
  detail?: Gql<TextField>;
  cardImage?: Gql<ImageField>;
  cardLink?: Gql<LinkField>;
}

interface DestinationsGridDatasource {
  heading?: Gql<TextField>;
  eyebrow?: Gql<TextField>;
  headingAccent?: Gql<TextField>;
  intro?: Gql<TextField>;
  children?: { results?: DestinationCardResult[] };
}

export interface DestinationsGridFields {
  data?: { datasource?: DestinationsGridDatasource };
}

export interface DestinationsGridProps {
  rendering: ComponentRendering & { fields?: DestinationsGridFields };
  fields?: DestinationsGridFields;
  params?: ComponentParams;
}

/** Inline card — fields rendered via SDK helpers off jsonValue → inline-editable in Pages. */
function DestinationCard({
  item,
  isEditing,
}: {
  item: DestinationCardResult;
  isEditing: boolean;
}): JSX.Element {
  const image = item.cardImage?.jsonValue;
  const hasImage = !!image?.value?.src;
  const link = item.cardLink?.jsonValue;
  const hasLink = !!link?.value?.href;
  const hasDistance = !!item.distance?.jsonValue?.value;

  return (
    <article className="card dest-card" data-reveal="">
      <div className="dest-media">
        <div className="sky" aria-hidden="true" />
        {(isEditing || hasImage) && image && (
          <Image field={image} data-fallback="" loading="lazy" />
        )}
      </div>
      <div className="dest-body">
        <div className="dest-row">
          <h3>
            <Text field={item.cardName?.jsonValue} />
          </h3>
          {(isEditing || hasDistance) && (
            <span className="dest-tag">
              <Text field={item.distance?.jsonValue} />
            </span>
          )}
        </div>
        <p>
          <Text field={item.detail?.jsonValue} />
        </p>
        {(isEditing || hasLink) && link && <Link field={link} className="dest-link" />}
      </div>
    </article>
  );
}

const DestinationsGrid = ({ fields, params }: DestinationsGridProps): JSX.Element => {
  const ds = fields?.data?.datasource;
  // Edit mode: jsonValue carries metadata only in Pages edit/preview.
  const isEditing = !!ds?.heading?.jsonValue?.metadata;
  const all = ds?.children?.results ?? [];
  // GridLimit rendering parameter: 0/absent = all; N = first N (e.g. 3 on Home preview).
  // Show all in editing so every card stays authorable.
  const limit = parseInt(String(params?.GridLimit ?? '0'), 10) || 0;
  const cards = !isEditing && limit > 0 ? all.slice(0, limit) : all;

  return (
    <section className="band atmos" id="destinations" aria-labelledby="dest-h">
      <div className="wrap">
        <div className="section-head" data-reveal="">
          {(isEditing || ds?.eyebrow?.jsonValue?.value) && (
            <span className="eyebrow">
              <Text field={ds?.eyebrow?.jsonValue} />
            </span>
          )}
          <h2 id="dest-h">
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
          {(isEditing || ds?.intro?.jsonValue?.value) && (
            <p>
              <Text field={ds?.intro?.jsonValue} />
            </p>
          )}
        </div>
        {isEditing && cards.length === 0 ? (
          <EditingEmpty component="DestinationsGrid" child="DestinationCard" />
        ) : (
          <div className="grid grid-3">
            {cards.map((item, i) => (
              <DestinationCard key={item.id || i} item={item} isEditing={isEditing} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DestinationsGrid;
