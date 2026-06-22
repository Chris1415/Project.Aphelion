/**
 * Marquee — CONTAINER via INTEGRATED GRAPHQL (resolver-patterns Pattern 3, Shape C).
 * componentName: "Marquee" (verbatim, ADR-0010). SERVER component (no hooks).
 *
 * The rendering carries an Integrated GraphQL query that returns the Destinations folder's
 * children, each with a `destName` alias for the Name field as `jsonValue`.
 *
 * IMPORTANT (resolver-patterns): a Rendering Contents Resolver WINS over the ComponentQuery when
 * both are set. The Children resolver must be CLEARED on this rendering for the query to run.
 *
 * Payload (Shape C — mirrors the query aliases):
 *   fields.data.datasource.children.results[].{destName}.jsonValue              (per child)
 *
 * TWO RENDER MODES (edit detected from field metadata — present ONLY in Pages edit mode, not
 * preview/normal; same server-side detection the other containers use, so NO 'use client'):
 *   • preview + normal → the REAL marquee: an aria-hidden, animated, looped strip of names.
 *   • Pages EDIT MODE  → a static, selectable management panel. The animated/aria-hidden strip
 *                        gives the editor nothing to grab, and Marquee has no fields of its own
 *                        (it MIRRORS the Destinations folder), so edit mode shows the names as
 *                        inline-editable chips + a note pointing at the shared source.
 *
 * The `destName` alias avoids the reserved `name` GraphQL field on items. Each chip is bound to a
 * Destination item's `Name` field, so editing a chip edits that destination everywhere it appears.
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
  const results = fields?.data?.datasource?.children?.results ?? [];
  // Edit mode: jsonValue carries `.metadata` only in Pages edit mode (not preview/normal).
  // Marquee has no folder scalar of its own, so derive editing from the children's destName.
  const isEditing = results.some((r) => !!r.destName?.jsonValue?.metadata);

  // EDIT MODE — static management panel (selectable on the canvas; chips are inline-editable).
  if (isEditing) {
    return (
      <div className="marquee-edit" role="group" aria-label="Marquee (decorative scrolling strip)">
        <p className="marquee-edit-note">
          <strong>Marquee</strong> — decorative scrolling strip, auto-generated from the{' '}
          <strong>Destinations</strong>. It shows each destination&apos;s name (it has no content
          of its own). Editing a chip below edits that <strong>Destination</strong> item wherever
          it appears; to change which destinations show, repoint this rendering&apos;s datasource.
        </p>
        <ul className="marquee-edit-list">
          {results.map((r, i) => (
            <li key={r.id || i} className="marquee-edit-chip">
              <Text field={r.destName?.jsonValue} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // PREVIEW + NORMAL — the real animated marquee. Duplicate for a continuous scroll loop.
  const names = results.map((r) => r.destName?.jsonValue?.value as string).filter(Boolean);
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
