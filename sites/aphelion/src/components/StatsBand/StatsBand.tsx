'use client';

/**
 * StatsBand — CLIENT component via INTEGRATED GRAPHQL (resolver-patterns Pattern 3, Shape C).
 * componentName: "StatsBand" (verbatim, ADR-0010).
 * Client because of the count-up animation (useCountUp + useSitecore hook).
 *
 * The rendering carries an Integrated GraphQL query (the rendering's "GraphQL Query" /
 * ComponentQuery field) that returns the folder's OWN scalar field AND its Stat children,
 * each field as `jsonValue`. `jsonValue` carries the field's editing metadata, so in XM Cloud
 * Pages metadata-edit-mode BOTH the section heading AND every stat field render INLINE-EDITABLE
 * through the SDK field helpers — without making each stat a placed rendering.
 *
 * IMPORTANT (resolver-patterns): a Rendering Contents Resolver WINS over the ComponentQuery when
 * both are set. The Children resolver must be CLEARED on this rendering for the query to run.
 *
 * Payload (Shape C — mirrors the query aliases):
 *   fields.data.datasource.{bandHeading}.jsonValue                              (scalar)
 *   fields.data.datasource.children.results[]
 *      .{statValue,statLabel}.jsonValue                                         (per stat)
 *
 * Client component. Editing derived from useSitecore().page.mode.isEditing.
 *
 * StatValue is SELF-DESCRIBING: the displayed value carries its own suffix/decimals, e.g.
 * "1240+", "100%", "4.9", "7". We parse the leading number to animate to, the trailing
 * non-numeric chars as the suffix, and decimals from the number.
 *
 * SDK shapes (verified against sites/aphelion/node_modules):
 *   TextField  react/types/components/Text.d.ts:8
 */

import { JSX } from 'react';
import { Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentRendering, ComponentParams } from '@sitecore-content-sdk/nextjs';
import { useCountUp } from 'lib/motion';
import { EditingEmpty } from 'lib/editing-empty';

/** `field(name:"X") { jsonValue }` → { jsonValue: <field object> } */
interface Gql<T> {
  jsonValue?: T;
}

interface StatResult {
  id?: string;
  name?: string;
  statValue?: Gql<TextField>;
  statLabel?: Gql<TextField>;
}

interface StatsBandDatasource {
  bandHeading?: Gql<TextField>;
  children?: { results?: StatResult[] };
}

export interface StatsBandFields {
  data?: { datasource?: StatsBandDatasource };
}

export interface StatsBandProps {
  rendering: ComponentRendering & { fields?: StatsBandFields };
  fields?: StatsBandFields;
  params?: ComponentParams;
}

/** Parse a self-describing stat value, e.g. "1240+" → {countTo:1240, suffix:'+', decimals:0}. */
function parseStat(raw: string): { countTo: number; suffix: string; decimals: number } {
  const match = raw.match(/^([\d.,]+)(.*)$/);
  const numStr = (match ? match[1] : raw).replace(/,/g, '');
  const countTo = parseFloat(numStr) || 0;
  const suffix = match ? match[2].trim() : '';
  const decimals = numStr.includes('.') ? (numStr.split('.')[1]?.length ?? 0) : 0;
  return { countTo, suffix, decimals };
}

/** Local client sub-component — NOT a registered rendering (inlined to dodge generate-map). */
function StatItem({ item, isEditing }: { item: StatResult; isEditing: boolean }): JSX.Element {
  const raw = String(item.statValue?.jsonValue?.value ?? '');
  const { countTo, suffix, decimals } = parseStat(raw);
  const { ref, displayValue } = useCountUp(countTo, { decimals, suffix });

  return (
    <div className="stat" data-reveal="">
      <div className="v">
        <span className="kinetic" ref={ref} data-countup={String(countTo)}>
          {isEditing ? (
            <Text field={item.statValue?.jsonValue} />
          ) : (
            displayValue
          )}
        </span>
      </div>
      <div className="l">
        <Text field={item.statLabel?.jsonValue} />
      </div>
    </div>
  );
}

const StatsBand = ({ fields }: StatsBandProps): JSX.Element => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const ds = fields?.data?.datasource;
  const items = ds?.children?.results ?? [];

  return (
    <section className="band stats-band atmos" aria-labelledby="stats-h">
      <div className="mesh" aria-hidden="true" />
      <h2 id="stats-h" className="sr-only">
        {ds?.bandHeading?.jsonValue?.value ? (
          <Text field={ds.bandHeading.jsonValue} />
        ) : (
          'Aphelion by the numbers'
        )}
      </h2>
      <div className="wrap">
        {isEditing && items.length === 0 ? (
          <EditingEmpty component="StatsBand" child="Stat" />
        ) : (
          <div className="stats-grid">
            {items.map((item, i) => (
              <StatItem key={item.id || i} item={item} isEditing={isEditing} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default StatsBand;
