/**
 * ContactDetails — CONTAINER component (ADR-0005 Shape B: Children resolver).
 * componentName: "ContactDetails" (verbatim, ADR-0010).
 *
 * Datasource = `ContactDetailsFolder` (scalar field SectionHeading — required)
 * whose children are `ContactDetailItem` items. The Children Rendering Contents Resolver
 * delivers the children as `fields.items` — Shape B per custom_content-sdk-resolver-patterns.
 *
 * Per resolver-patterns rule, each `items[i].fields` is read MANUALLY (`.value`).
 * SectionHeading is a required scalar → always rendered via SDK <Text>.
 *
 * Server component (no hooks): editing mode derived from the SectionHeading field's metadata.
 *
 * SDK shapes (verified against sites/aphelion/node_modules):
 *   TextField  react/types/components/Text.d.ts:8
 *   LinkField  react/types/components/Link.d.ts:24   (value.href)
 */

import { JSX } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { TextField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { ComponentRendering, ComponentParams } from '@sitecore-content-sdk/nextjs';

/** Per-child field hash — ContactDetailItem template */
interface ContactDetailItemFields {
  DetailLabel?: TextField;
  DetailValue?: TextField;
  DetailLink?: LinkField;
}

/** Children-resolver item wrapper (Shape B) */
interface ChildItem {
  id: string;
  url?: string;
  name?: string;
  fields: ContactDetailItemFields;
}

/** ContactDetailsFolder scalar fields + resolver-injected `items` */
export interface ContactDetailsFields {
  SectionHeading?: TextField;
  items?: ChildItem[];
}

export interface ContactDetailsProps {
  rendering: ComponentRendering & { fields?: ContactDetailsFields };
  fields?: ContactDetailsFields;
  params?: ComponentParams;
}

/** Local presentational list item — NOT a registered rendering (inlined to dodge generate-map). */
function ContactDetailItem({ item }: { item: ChildItem }): JSX.Element {
  const f = item.fields;
  const href = f.DetailLink?.value?.href;

  return (
    <li className="contact-detail-item">
      <span className="contact-detail-label">{f.DetailLabel?.value as string}</span>
      {href ? (
        <a href={href} className="contact-detail-value dest-link">
          {f.DetailValue?.value as string}
        </a>
      ) : (
        <span className="contact-detail-value">{f.DetailValue?.value as string}</span>
      )}
    </li>
  );
}

const ContactDetails = ({ fields }: ContactDetailsProps): JSX.Element => {
  // SectionHeading is required (always rendered) and the per-item DetailLink is read
  // manually, so no editing-mode gate is needed here.
  const items = fields?.items ?? [];

  return (
    <section className="band contact-details-band" aria-labelledby="cd-h">
      <div className="wrap">
        <h2 id="cd-h" className="contact-details-heading" data-reveal="">
          <Text field={fields?.SectionHeading} />
        </h2>
        <ul className="contact-details-list" data-reveal="" data-delay="1">
          {items.map((item) => (
            <ContactDetailItem
              key={item.id || (item.fields.DetailLabel?.value as string)}
              item={item}
            />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ContactDetails;
