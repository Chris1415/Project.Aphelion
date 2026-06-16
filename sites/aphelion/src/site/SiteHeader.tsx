/**
 * SiteHeader — sticky, blur, brand mark + desktop nav + ThemeToggle.
 * Chrome (ADR-0005 nav exception) — NOT a Sitecore rendering. Ported from the static app.
 * Lives in src/site/ (NOT src/components/) so generate-map doesn't register it.
 * Rendered from Layout.tsx. Static nav from src/site/navigation.
 *
 * The mobile menu trigger is owned by MobileNav (rendered alongside this in Layout.tsx),
 * not here — a duplicate static ☰ button would break aria-expanded state.
 */

import Link from 'next/link';
import { ThemeToggle } from 'src/ui/theme-toggle';
import { headerNav } from 'src/site/navigation';

export function SiteHeader() {
  return (
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

          {/* Actions — ThemeToggle only; mobile menu trigger is in MobileNav */}
          <div className="header-actions">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
