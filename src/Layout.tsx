import { JSX } from 'react';
import { AppPlaceholder, DesignLibraryApp, Field, Page } from '@sitecore-content-sdk/nextjs';
import Scripts from 'src/Scripts';
import SitecoreStyles from 'components/content-sdk/SitecoreStyles';
import componentMap from '.sitecore/component-map';

interface LayoutProps {
  page: Page;
}

export interface RouteFields {
  [key: string]: unknown;
  Title?: Field;
}

const Layout = ({ page }: LayoutProps): JSX.Element => {
  const { layout, mode } = page;
  const { route } = layout.sitecore;
  const mainClassPageEditing = mode.isEditing ? 'editing-mode' : 'prod-mode';
  return (
    <>
      <Scripts />
      <SitecoreStyles layoutData={layout} />
      {/* root placeholder for the app, which we add components to using route data */}
      <div className={mainClassPageEditing}>
        {mode.isDesignLibrary ? (
          route && (
            <DesignLibraryApp
              page={page}
              rendering={route}
              componentMap={componentMap}
              loadServerImportMap={() => import('.sitecore/import-map.server')}
            />
          )
        ) : (
          <>
            {/* Header / Footer are Content SDK renderings placed in these placeholders.
                They render their own <header>/<footer>, so the placeholders sit directly in
                the flow with no wrapping element — a tight wrapper would break the sticky header. */}
            {route && (
              <AppPlaceholder
                page={page}
                componentMap={componentMap}
                name="headless-header"
                rendering={route}
              />
            )}
            <main id="main-content">
              <div id="content">
                {route && (
                  <AppPlaceholder
                    page={page}
                    componentMap={componentMap}
                    name="headless-main"
                    rendering={route}
                  />
                )}
              </div>
            </main>
            {route && (
              <AppPlaceholder
                page={page}
                componentMap={componentMap}
                name="headless-footer"
                rendering={route}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Layout;
