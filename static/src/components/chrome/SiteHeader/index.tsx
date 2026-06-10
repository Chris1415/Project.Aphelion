/**
 * SiteHeader — sticky, blur, brand mark + desktop nav + ThemeToggle
 * ADR-0005: chrome / nav exception — NOT a content-model rendering.
 * Nav links from src/content/navigation.ts, pointing to REAL routes.
 *
 * NOTE: The mobile menu trigger button is NOT rendered here.
 * MobileNav (rendered alongside SiteHeader in layout.tsx) owns its own
 * trigger button with the correct interactive aria-expanded state.
 * A duplicate static button here would produce two non-functional ☰
 * buttons at mobile widths (both have .menu-toggle CSS class), breaking
 * both UX and WCAG 4.1.2 (Name/Role/Value — aria-expanded never updates).
 */

import Link from 'next/link';
import { ThemeToggle } from '@/ui/theme-toggle';
import { headerNav } from '@/content/navigation';

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
