/**
 * Marquee — CONTAINER component (ADR-0005 Shape B: Children resolver).
 * componentName: "Marquee" (verbatim, ADR-0010).
 *
 * Datasource = `DestinationsFolder` (Children resolver, reads only `Name` per child).
 * The Children Rendering Contents Resolver delivers the children as `fields.items` —
 * Shape B per custom_content-sdk-resolver-patterns.
 *
 * Per resolver-patterns rule, each `items[i].fields` is read MANUALLY (`.value`).
 * No scalar fields, no editing logic. Names duplicated for continuous scroll illusion.
 *
 * Server component (no hooks). aria-hidden="true" — purely decorative.
 *
 * SDK shapes (verified against sites/aphelion/node_modules):
 *   TextField  react/types/components/Text.d.ts:8
 */

import { JSX } from 'react';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentRendering, ComponentParams } from '@sitecore-content-sdk/nextjs';

/** Per-child field hash — reads only the Name field */
interface MarqueeItemFields {
  Name?: TextField;
}

/** Children-resolver item wrapper (Shape B) */
interface ChildItem {
  id: string;
  url?: string;
  name?: string;
  fields: MarqueeItemFields;
}

/** Resolver-injected `items` only — no scalar fields */
export interface MarqueeFields {
  items?: ChildItem[];
}

export interface MarqueeProps {
  rendering: ComponentRendering & { fields?: MarqueeFields };
  fields?: MarqueeFields;
  params?: ComponentParams;
}

const Marquee = ({ fields }: MarqueeProps): JSX.Element => {
  const names = (fields?.items ?? [])
    .map((i) => i.fields.Name?.value as string)
    .filter(Boolean);
  // Duplicate for continuous scroll loop
  const all = [...names, ...names];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {all.map((name, idx) => (
          <span key={`marquee-${idx}`} className="marquee-item">
            {name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
