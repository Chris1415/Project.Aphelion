import { JSX } from 'react';
import { AppPlaceholder, DesignLibraryApp, Field, Page } from '@sitecore-content-sdk/nextjs';
import Scripts from 'src/Scripts';
import SitecoreStyles from 'components/content-sdk/SitecoreStyles';
import componentMap from '.sitecore/component-map';
import { SiteHeader } from 'src/site/SiteHeader';
import { MobileNav } from 'src/site/MobileNav';
import { SiteFooter } from 'src/site/SiteFooter';

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
            {/* Chrome (ADR-0005 nav exception) — rendered from the layout, NOT via
                placeholders / the component-map. Static nav for now (src/site/). */}
            <SiteHeader />
            <MobileNav />
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
            <SiteFooter />
          </>
        )}
      </div>
    </>
  );
};

export default Layout;
