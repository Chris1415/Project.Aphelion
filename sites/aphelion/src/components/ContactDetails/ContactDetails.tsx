/**
 * ContactDetails — CONTAINER via INTEGRATED GRAPHQL (resolver-patterns Pattern 3, Shape C).
 * componentName: "ContactDetails" (verbatim, ADR-0010).
 *
 * The rendering carries an Integrated GraphQL query (the rendering's "GraphQL Query" /
 * ComponentQuery field) that returns the folder's OWN scalar field AND its ContactDetailItem
 * children, each field as `jsonValue`. `jsonValue` carries the field's editing metadata, so in
 * XM Cloud Pages metadata-edit-mode BOTH the section heading AND every item field render
 * INLINE-EDITABLE through the SDK field helpers — without making each item a placed rendering.
 *
 * IMPORTANT (resolver-patterns): a Rendering Contents Resolver WINS over the ComponentQuery when
 * both are set. The Children resolver must be CLEARED on this rendering for the query to run.
 *
 * Payload (Shape C — mirrors the query aliases):
 *   fields.data.datasource.{sectionHeading}.jsonValue                           (scalar)
 *   fields.data.datasource.children.results[]
 *      .{detailLabel,detailValue,detailLink}.jsonValue                          (per item)
 *
 * Server component. Editing derived from sectionHeading.jsonValue.metadata (present only in
 * edit mode).
 *
 * SDK shapes (verified against sites/aphelion/node_modules):
 *   TextField  react/types/components/Text.d.ts:8   (extends FieldMetadata → .metadata)
 *   LinkField  react/types/components/Link.d.ts:24
 */

import { JSX } from 'react';
import { Text, Link } from '@sitecore-content-sdk/nextjs';
import type { TextField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { ComponentRendering, ComponentParams } from '@sitecore-content-sdk/nextjs';

/** `field(name:"X") { jsonValue }` → { jsonValue: <field object> } */
interface Gql<T> {
  jsonValue?: T;
}

interface ContactDetailItemResult {
  id?: string;
  name?: string;
  detailLabel?: Gql<TextField>;
  detailValue?: Gql<TextField>;
  detailLink?: Gql<LinkField>;
}

interface ContactDetailsDatasource {
  sectionHeading?: Gql<TextField>;
  children?: { results?: ContactDetailItemResult[] };
}

export interface ContactDetailsFields {
  data?: { datasource?: ContactDetailsDatasource };
}

export interface ContactDetailsProps {
  rendering: ComponentRendering & { fields?: ContactDetailsFields };
  fields?: ContactDetailsFields;
  params?: ComponentParams;
}

/** Inline list item — fields rendered via SDK helpers off jsonValue → inline-editable in Pages. */
function ContactDetailItem({
  item,
  isEditing,
}: {
  item: ContactDetailItemResult;
  isEditing: boolean;
}): JSX.Element {
  const link = item.detailLink?.jsonValue;
  const hasLink = !!link?.value?.href;

  return (
    <li className="contact-detail-item">
      <span className="contact-detail-label">
        <Text field={item.detailLabel?.jsonValue} />
      </span>
      {(isEditing || hasLink) && link ? (
        <Link field={link} className="contact-detail-value dest-link" />
      ) : (
        <span className="contact-detail-value">
          <Text field={item.detailValue?.jsonValue} />
        </span>
      )}
    </li>
  );
}

const ContactDetails = ({ fields }: ContactDetailsProps): JSX.Element => {
  const ds = fields?.data?.datasource;
  // Edit mode: jsonValue carries metadata only in Pages edit/preview.
  const isEditing = !!ds?.sectionHeading?.jsonValue?.metadata;
  const items = ds?.children?.results ?? [];

  return (
    <section className="band contact-details-band" aria-labelledby="cd-h">
      <div className="wrap">
        <h2 id="cd-h" className="contact-details-heading" data-reveal="">
          <Text field={ds?.sectionHeading?.jsonValue} />
        </h2>
        <ul className="contact-details-list" data-reveal="" data-delay="1">
          {items.map((item, i) => (
            <ContactDetailItem key={item.id || i} item={item} isEditing={isEditing} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ContactDetails;
