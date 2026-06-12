/**
 * Container — compositional layout primitive (AppPlaceholder host). NO datasource.
 * componentName: "Container".
 *
 * Renders ONE nested placeholder that authors fill with ANY registered rendering in Pages —
 * the open-composition counterpart to the typed Children-resolver containers (DestinationsGrid).
 *
 * MUST be a SERVER component. Build-trap #7: the parent AppPlaceholder injects `page` +
 * the SERVER `componentMap` into each *server* child's props (AppPlaceholder.js:46); it does
 * NOT do so for client children (they go through ClientComponentWrapper). A bare <Placeholder>
 * or a 'use client' container would resolve children against the CLIENT map → every child
 * renders as "unknown component". So: server component + forward the injected page/componentMap
 * into our own <AppPlaceholder>.
 *
 * Sitecore placeholder settings key (dynamic): "container-{*}" → pattern ^container-\d+$ matches
 * the requested "container-1" (getDynamicPlaceholderPattern, content/layout/utils.js).
 *
 * SDK shapes (verified against sites/aphelion/node_modules):
 *   AppPlaceholderProps react/types/components/Placeholder/models.d.ts:103 (requires page + componentMap)
 */

import { JSX } from 'react';
import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import type {
  ComponentRendering,
  ComponentParams,
  Page,
  ComponentMap,
} from '@sitecore-content-sdk/nextjs';

export interface ContainerProps {
  rendering: ComponentRendering;
  params?: ComponentParams;
  /** Injected by the parent AppPlaceholder for server children (build-trap #7). */
  page?: Page;
  componentMap?: ComponentMap;
}

const Container = ({ rendering, params, page, componentMap }: ContainerProps): JSX.Element => {
  // Optional SXA-style style classes passed through from the rendering parameters.
  const styles = (params?.Styles as string | undefined) ?? '';

  return (
    <section className={`band container-block ${styles}`.trim()}>
      <div className="wrap">
        <AppPlaceholder
          name="container-1"
          rendering={rendering}
          page={page as Page}
          componentMap={componentMap as ComponentMap}
        />
      </div>
    </section>
  );
};

export default Container;
