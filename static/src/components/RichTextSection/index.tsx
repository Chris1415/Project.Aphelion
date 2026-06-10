/**
 * RichTextSection — leaf component (ADR-0005 rule 1: one flat Props object).
 * Portability contract:
 *   - heading → Single-Line Text field
 *   - body    → Rich Text field (HTML markup)
 *
 * SECURITY NOTE: body originates ONLY from the hard-coded static content modules
 * under src/content/ (PRD-000; ADR-0005; task T027). No user-supplied HTML ever
 * reaches this component. dangerouslySetInnerHTML is intentional and XSS-safe
 * in this context. When porting to head-app (PRD-001), Sitecore's RichText
 * field component renders server-side with its own sanitization.
 */

export interface RichTextSectionProps {
  heading: string;
  body: string;
}

export function RichTextSection({ heading, body }: RichTextSectionProps) {
  return (
    <section className="band rts-band" aria-labelledby="rts-h">
      <div className="wrap">
        <div className="section-head" data-reveal="">
          <h2 id="rts-h">{heading}</h2>
        </div>
        {/* Static trusted content — source is src/content/about.ts only (T027 note above) */}
        <div
          className="rts-body prose"
          // nosec: static trusted content (see file header)
          dangerouslySetInnerHTML={{ __html: body }} /* nosec */
          data-reveal=""
          data-delay="1"
        />
      </div>
    </section>
  );
}
