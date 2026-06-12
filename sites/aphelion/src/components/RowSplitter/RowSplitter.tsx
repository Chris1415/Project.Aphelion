/**
 * RowSplitter — compositional layout primitive (AppPlaceholder host). NO datasource.
 * componentName: "RowSplitter" (verbatim, ADR-0010).
 *
 * Renders N nested row placeholders that authors fill with registered renderings in Pages.
 * Follows the Container.tsx splitter pattern exactly (build-trap #7):
 *   MUST be a SERVER component — forwards injected `page` + SERVER `componentMap` into
 *   each <AppPlaceholder> so children resolve against the server map, not the client map.
 *
 * Param `Rows` (default 2): number of row placeholders to render (row-1, row-2, ...).
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

export interface RowSplitterProps {
  rendering: ComponentRendering;
  params?: ComponentParams;
  /** Injected by the parent AppPlaceholder for server children (build-trap #7). */
  page?: Page;
  componentMap?: ComponentMap;
}

const RowSplitter = ({ rendering, params, page, componentMap }: RowSplitterProps): JSX.Element => {
  const count = parseInt(String(params?.Rows ?? '2'), 10) || 2;

  return (
    <div className="row-splitter">
      {Array.from({ length: count }).map((_, i) => (
        <AppPlaceholder
          key={i}
          name={`row-${i + 1}`}
          rendering={rendering}
          page={page as Page}
          componentMap={componentMap as ComponentMap}
        />
      ))}
    </div>
  );
};

export default RowSplitter;
