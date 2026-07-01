/**
 * Container — STANDARD SXA layout component, taken over verbatim from the official
 * xmcloud-starter-js (examples/kit-nextjs-article-starter/src/components/sxa/Container.tsx,
 * Content SDK v2 / App Router). componentName: "Container".
 *
 * Binds to the standard SXA `Container` rendering already in the tenant — no custom build.
 * Server component: imports the SERVER componentMap directly and forwards the injected `page`
 * to AppPlaceholder (build-trap #7). Aphelion's `ComponentProps` doesn't carry `page`, so it's
 * added to the local props interface (the only deviation from the upstream file).
 */

import { JSX } from 'react';
import {
  ComponentParams,
  ComponentRendering,
  AppPlaceholder,
} from '@sitecore-content-sdk/nextjs';
import type { Page } from '@sitecore-content-sdk/nextjs';
import componentMap from '.sitecore/component-map';
import { ComponentProps } from 'lib/component-props';

interface ContainerProps extends ComponentProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  page?: Page;
}

const DefaultContainer = (props: ContainerProps): JSX.Element => {
  const containerStyles = props.params && props.params.Styles ? props.params.Styles : '';
  const styles = `${props.params.GridParameters ?? ''} ${containerStyles}`.trimEnd();
  const phKey = `container-${props.params.DynamicPlaceholderId}`;
  const id = props.params.RenderingIdentifier;
  const mediaUrlPattern = new RegExp(/mediaurl="([^"]*)"/, 'i');
  const backgroundImage = props.params.BackgroundImage as string;
  let backgroundStyle: { [key: string]: string } = {};

  if (backgroundImage && backgroundImage.match(mediaUrlPattern)) {
    const mediaUrl = backgroundImage.match(mediaUrlPattern)?.[1] || '';
    backgroundStyle = {
      backgroundImage: `url('${mediaUrl}')`,
    };
  }

  return (
    <div className={`component container-default ${styles}`} id={id ? id : undefined}>
      <div className="component-content" style={backgroundStyle}>
        <div className="row">
          <AppPlaceholder
            name={phKey}
            rendering={props.rendering}
            page={props.page as Page}
            componentMap={componentMap}
          />
        </div>
      </div>
    </div>
  );
};

export const Default = ({ params, rendering, page }: ContainerProps): JSX.Element => {
  const splitStyles = params?.Styles?.split(' ');

  if (splitStyles && splitStyles.includes('container')) {
    return (
      <div className="container-wrapper">
        <DefaultContainer params={params} rendering={rendering} page={page} />
      </div>
    );
  }

  return <DefaultContainer params={params} rendering={rendering} page={page} />;
};
