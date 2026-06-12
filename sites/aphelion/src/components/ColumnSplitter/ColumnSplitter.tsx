/**
 * ColumnSplitter — compositional layout primitive (AppPlaceholder host). NO datasource.
 * componentName: "ColumnSplitter" (verbatim, ADR-0010).
 *
 * Renders N column divs each hosting an <AppPlaceholder> that authors fill in Pages.
 * Follows the Container.tsx splitter pattern exactly (build-trap #7):
 *   MUST be a SERVER component — forwards injected `page` + SERVER `componentMap` into
 *   each <AppPlaceholder> so children resolve against the server map, not the client map.
 *
 * Param `Columns` (default 2): number of column placeholders to render (column-1, column-2, ...).
 *
 * SDK shapes (verified against sites/aphelion/node_modules):
 *   AppPlaceholderProps react/types/components/Placeholder/models.d.ts:103
 */

import { JSX } from 'react';
import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import type {
  ComponentRendering,
  ComponentParams,
  Page,
  ComponentMap,
} from '@sitecore-content-sdk/nextjs';

export interface ColumnSplitterProps {
  rendering: ComponentRendering;
  params?: ComponentParams;
  /** Injected by the parent AppPlaceholder for server children (build-trap #7). */
  page?: Page;
  componentMap?: ComponentMap;
}

const ColumnSplitter = ({
  rendering,
  params,
  page,
  componentMap,
}: ColumnSplitterProps): JSX.Element => {
  const count = parseInt(String(params?.Columns ?? '2'), 10) || 2;

  return (
    <div className="split-cols">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="col">
          <AppPlaceholder
            name={`column-${i + 1}`}
            rendering={rendering}
            page={page as Page}
            componentMap={componentMap as ComponentMap}
          />
        </div>
      ))}
    </div>
  );
};

export default ColumnSplitter;
