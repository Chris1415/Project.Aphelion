/**
 * ColumnSplitter — STANDARD SXA layout component, taken over from the official xmcloud-starter-js
 * (examples/kit-nextjs-article-starter/src/components/sxa/ColumnSplitter.tsx, Content SDK v2 /
 * App Router). componentName: "ColumnSplitter". `page?` added locally (Aphelion's ComponentProps
 * doesn't carry it) — the only deviation from upstream.
 *
 * Binds to the standard SXA `ColumnSplitter` rendering already in the tenant — no custom build.
 * Standard params: EnabledPlaceholders ("1,2,…"), per-column ColumnWidth{N} + Styles{N}.
 * Placeholder key per column: `column-${n}-{*}` (dynamic). Server component: imports the SERVER
 * componentMap and forwards the injected `page` (build-trap #7).
 */

import { JSX } from 'react';
import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import type { Page } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import componentMap from '.sitecore/component-map';

/** Up to 8 columns. */
type ColumnNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** Per-column width: ColumnWidth1 … ColumnWidth8. */
type ColumnWidths = {
  [K in ColumnNumber as `ColumnWidth${K}`]?: string;
};

/** Per-column styles: Styles1 … Styles8. */
type ColumnStyles = {
  [K in ColumnNumber as `Styles${K}`]?: string;
};

interface ColumnSplitterProps extends ComponentProps {
  page?: Page;
  params: ComponentProps['params'] & ColumnWidths & ColumnStyles;
}

export const Default = ({ params, rendering, page }: ColumnSplitterProps): JSX.Element => {
  const { EnabledPlaceholders, RenderingIdentifier: id, styles } = params;
  const enabledColumns = EnabledPlaceholders?.split(',') ?? [];

  return (
    <div className={`row component column-splitter ${styles ?? ''}`} id={id}>
      {enabledColumns.map((columnNum, index) => {
        const num = Number(columnNum) as ColumnNumber;
        const columnWidth = params[`ColumnWidth${num}`] ?? '';
        const columnStyle = params[`Styles${num}`] ?? '';
        const columnClassNames = `${columnWidth} ${columnStyle}`.trim();

        return (
          <div key={index} className={columnClassNames}>
            <div className="row">
              <AppPlaceholder
                name={`column-${columnNum}-{*}`}
                rendering={rendering}
                page={page as Page}
                componentMap={componentMap}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
