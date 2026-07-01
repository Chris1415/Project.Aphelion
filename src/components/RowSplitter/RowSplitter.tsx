/**
 * RowSplitter — STANDARD SXA layout component, taken over from the official xmcloud-starter-js
 * (examples/kit-nextjs-article-starter/src/components/sxa/RowSplitter.tsx, Content SDK v2 /
 * App Router). componentName: "RowSplitter". `page?` added locally (Aphelion's ComponentProps
 * doesn't carry it) — the only deviation from upstream.
 *
 * Binds to the standard SXA `RowSplitter` rendering already in the tenant — no custom build.
 * Standard params: EnabledPlaceholders ("1,2,…"), per-row Styles{N}. Placeholder key per row:
 * `row-${n}-{*}` (dynamic). Server component: imports the SERVER componentMap and forwards the
 * injected `page` (build-trap #7).
 */

import { JSX } from 'react';
import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import type { ComponentRendering, Page } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import componentMap from '.sitecore/component-map';

/** Up to 8 rows. */
type RowNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** Per-row styles: Styles1 … Styles8. */
type RowStyles = {
  [K in `Styles${RowNumber}`]?: string;
};

interface RowSplitterProps extends ComponentProps {
  rendering: ComponentRendering;
  page?: Page;
  params: ComponentProps['params'] & RowStyles;
}

export const Default = ({ params, rendering, page }: RowSplitterProps): JSX.Element => {
  const enabledPlaceholders = params.EnabledPlaceholders?.split(',') ?? [];
  const id = params.RenderingIdentifier;

  return (
    <div className={`component row-splitter ${params.styles ?? ''}`} id={id}>
      {enabledPlaceholders.map((ph, index) => {
        const num = Number(ph) as RowNumber;
        const placeholderKey = `row-${num}-{*}`;
        const rowStyles = `${params[`Styles${num}`] ?? ''}`.trimEnd();

        return (
          <div key={index} className={`container-fluid ${rowStyles}`.trimEnd()}>
            <div>
              <div className="row">
                <AppPlaceholder
                  name={placeholderKey}
                  rendering={rendering}
                  page={page as Page}
                  componentMap={componentMap}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
