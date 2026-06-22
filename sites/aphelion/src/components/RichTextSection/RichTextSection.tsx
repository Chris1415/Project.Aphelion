/**
 * RichTextSection — SDK field-driven leaf component (Server map — no hooks, pure render).
 * ADR-0005 Shape A: flat datasource fields.
 * Field names: SectionHeading (Text/Single-Line), Body (RichText).
 * componentName: "RichTextSection" (verbatim, ADR-0010).
 *
 * Markup/CSS ported verbatim from static/src/components/RichTextSection/index.tsx.
 * Body field: the only RichTextField in the registry — rendered via <RichText> which
 * outputs server-rendered HTML (Sitecore sanitizes on write, no XSS risk on read).
 *
 * SDK shapes (verified at T003 against sites/aphelion/node_modules):
 *   TextField     node_modules/@sitecore-content-sdk/react/types/components/Text.d.ts:8
 *   RichTextField node_modules/@sitecore-content-sdk/react/types/components/RichText.d.ts:8
 */

import { JSX } from 'react';
import { Text, RichText } from '@sitecore-content-sdk/nextjs';
import type { TextField, RichTextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentRendering, ComponentParams } from '@sitecore-content-sdk/nextjs';

export interface RichTextSectionFields {
  SectionHeading?: TextField;
  Body?: RichTextField;
}

export interface RichTextSectionProps {
  rendering: ComponentRendering & { fields?: RichTextSectionFields };
  fields?: RichTextSectionFields;
  params?: ComponentParams;
}

const RichTextSection = ({ fields }: RichTextSectionProps): JSX.Element => {
  return (
    <section className="band rts-band" aria-labelledby="rts-h">
      <div className="wrap">
        <div className="section-head" data-reveal="">
          <h2 id="rts-h">
            <Text field={fields?.SectionHeading} />
          </h2>
        </div>
        {/* RichText renders HTML from the Sitecore rich text field (server-side, safe) */}
        <RichText
          field={fields?.Body}
          className="rts-body prose"
          data-reveal=""
          data-delay="1"
        />
      </div>
    </section>
  );
};

export default RichTextSection;
