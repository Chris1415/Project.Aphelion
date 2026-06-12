'use client';

/**
 * StatsBand — CLIENT component (ADR-0005 Shape B: Children resolver).
 * componentName: "StatsBand" (verbatim, ADR-0010).
 * Client because of the count-up animation (useCountUp + useSitecore hook).
 *
 * Datasource = `StatsBandFolder` (optional scalar BandHeading) whose children are `Stat`
 * items. The Children Rendering Contents Resolver delivers them as `fields.items` (Shape B).
 *
 * StatValue is SELF-DESCRIBING: the displayed value carries its own suffix/decimals, e.g.
 * "1240+", "100%", "4.9", "7". We parse the leading number to animate to, the trailing
 * non-numeric chars as the suffix, and decimals from the number. This avoids band-level
 * suffix/decimals params (which can't represent heterogeneous stats) — so NO StatsBandParams
 * template is needed.
 *
 * Editing mode from useSitecore().page.mode.isEditing — the client-safe path (shows the raw
 * value instead of animating from 0).
 *
 * SDK shapes (verified against sites/aphelion/node_modules):
 *   TextField  react/types/components/Text.d.ts:8
 */

import { JSX } from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentRendering, ComponentParams } from '@sitecore-content-sdk/nextjs';
import { useCountUp } from 'lib/motion';

/** Per-child field hash — Stat template */
interface StatFields {
  StatValue?: TextField;
  StatLabel?: TextField;
}

/** Children-resolver item wrapper (Shape B) */
interface ChildItem {
  id: string;
  url?: string;
  name?: string;
  fields: StatFields;
}

/** StatsBandFolder scalar field + resolver-injected `items` */
export interface StatsBandFields {
  BandHeading?: TextField;
  items?: ChildItem[];
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
function StatItem({ item, isEditing }: { item: ChildItem; isEditing: boolean }): JSX.Element {
  const f = item.fields;
  const raw = String(f.StatValue?.value ?? '');
  const { countTo, suffix, decimals } = parseStat(raw);
  const { ref, displayValue } = useCountUp(countTo, { decimals, suffix });

  return (
    <div className="stat" data-reveal="">
      <div className="v">
        <span className="kinetic" ref={ref} data-countup={String(countTo)}>
          {isEditing ? raw : displayValue}
        </span>
      </div>
      <div className="l">{f.StatLabel?.value as string}</div>
    </div>
  );
}

const StatsBand = ({ fields }: StatsBandProps): JSX.Element => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  const items = fields?.items ?? [];

  return (
    <section className="band stats-band atmos" aria-labelledby="stats-h">
      <div className="mesh" aria-hidden="true" />
      <h2 id="stats-h" className="sr-only">
        {(fields?.BandHeading?.value as string) || 'Aphelion by the numbers'}
      </h2>
      <div className="wrap">
        <div className="stats-grid">
          {items.map((item) => (
            <StatItem
              key={item.id || (item.fields.StatValue?.value as string)}
              item={item}
              isEditing={isEditing}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBand;
