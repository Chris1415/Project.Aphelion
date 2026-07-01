/**
 * PartialDesignDynamicPlaceholder — STANDARD SXA component that powers Partial Designs.
 * componentName: "PartialDesignDynamicPlaceholder". Taken from the official xmcloud-starter-js
 * (examples/basic-nextjs) — it ships with the scaffold there but was missing from this app, so
 * Partial Designs rendered the orange "missing React implementation" box.
 *
 * Renders the dynamic placeholder whose key comes from the rendering's `sig` parameter, using
 * AppPlaceholder + the SERVER componentMap (build-trap #7). Server component. `page?` added to
 * the local props type (Aphelion's ComponentProps doesn't carry it).
 */

import { JSX } from 'react';
import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import type { Page } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import componentMap from '.sitecore/component-map';

const PartialDesignDynamicPlaceholder = (
  props: ComponentProps & { page?: Page }
): JSX.Element => (
  <AppPlaceholder
    name={props.rendering?.params?.sig || ''}
    rendering={props.rendering}
    page={props.page as Page}
    componentMap={componentMap}
  />
);

export default PartialDesignDynamicPlaceholder;
