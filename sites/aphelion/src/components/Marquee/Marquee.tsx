/**
 * Marquee — CONTAINER via INTEGRATED GRAPHQL (resolver-patterns Pattern 3, Shape C).
 * componentName: "Marquee" (verbatim, ADR-0010).
 *
 * The rendering carries an Integrated GraphQL query (the rendering's "GraphQL Query" /
 * ComponentQuery field) that returns the Destinations folder's children, each with a
 * `destName` alias for the Name field as `jsonValue`.
 *
 * IMPORTANT (resolver-patterns): a Rendering Contents Resolver WINS over the ComponentQuery when
 * both are set. The Children resolver must be CLEARED on this rendering for the query to run.
 *
 * Payload (Shape C — mirrors the query aliases):
 *   fields.data.datasource.children.results[].{destName}.jsonValue              (per child)
 *
 * Server component (no hooks). aria-hidden="true" — purely decorative. No editing chrome needed.
 *
 * The `destName` alias avoids the reserved `name` GraphQL field on items.
 *
 * SDK shapes (verified against sites/aphelion/node_modules):
 *   TextField  react/types/components/Text.d.ts:8
 */

import { JSX } from 'react';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentRendering, ComponentParams } from '@sitecore-content-sdk/nextjs';

/** `field(name:"X") { jsonValue }` → { jsonValue: <field object> } */
interface Gql<T> {
  jsonValue?: T;
}

interface MarqueeItemResult {
  id?: string;
  name?: string;
  destName?: Gql<TextField>;
}

interface MarqueeDatasource {
  children?: { results?: MarqueeItemResult[] };
}

export interface MarqueeFields {
  data?: { datasource?: MarqueeDatasource };
}

export interface MarqueeProps {
  rendering: ComponentRendering & { fields?: MarqueeFields };
  fields?: MarqueeFields;
  params?: ComponentParams;
}

const Marquee = ({ fields }: MarqueeProps): JSX.Element => {
  const ds = fields?.data?.datasource;
  const names = (ds?.children?.results ?? [])
    .map((r) => r.destName?.jsonValue?.value as string)
    .filter(Boolean);
  // Duplicate for continuous scroll loop
  const all = [...names, ...names];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {all.map((n, i) => (
          <span key={`marquee-${i}`} className="marquee-item">
            {n}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
