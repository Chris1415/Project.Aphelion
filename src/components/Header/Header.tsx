/**
 * Header — Content SDK rendering (componentName "Header"). Place in the `headless-header`
 * placeholder in Pages. Static chrome (ADR-0005 nav exception): sticky brand + desktop nav +
 * ThemeToggle + MobileNav. Nav is hardcoded (src/site/navigation) for now — no datasource.
 *
 * Renders its own <header className="site-header"> (sticky). Layout places this placeholder
 * directly in the flow (no wrapping <header>) so the sticky positioning works. MobileNav +
 * navigation live in src/site/ (NOT src/components/) so generate-map doesn't register them.
 */

import { JSX } from 'react';
import Link from 'next/link';
import { ThemeToggle } from 'src/ui/theme-toggle';
import { MobileNav } from 'src/site/MobileNav';
import { headerNav } from 'src/site/navigation';

const Header = (): JSX.Element => (
  <>
    <header className="site-header" role="banner">
      <div className="wrap">
        <div className="header-inner">
          {/* Brand */}
          <Link href="/" className="brand" aria-label="Aphelion — Home">
            <span className="mark" aria-hidden="true" />
            <span>Aphelion</span>
          </Link>

          {/* Desktop nav */}
          <nav className="nav-desktop" aria-label="Main navigation">
            {headerNav.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions — ThemeToggle; the mobile menu trigger is owned by MobileNav */}
          <div className="header-actions">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
    <MobileNav />
  </>
);

export default Header;
