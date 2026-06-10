/**
 * SiteHeader — sticky, blur, brand mark + desktop nav + ThemeToggle + menu button
 * ADR-0005: chrome / nav exception — NOT a content-model rendering.
 * Nav links from src/content/navigation.ts, pointing to REAL routes.
 */

import Link from 'next/link';
import { ThemeToggle } from '@/ui/theme-toggle';
import { headerNav } from '@/content/navigation';

interface SiteHeaderProps {
  onMenuOpen?: () => void;
}

export function SiteHeader({ onMenuOpen }: SiteHeaderProps) {
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

          {/* Actions */}
          <div className="header-actions">
            <ThemeToggle />
            {/* Menu button — rendered client-side in MobileNav; here we emit it for SSR hydration */}
            <button
              type="button"
              className="menu-toggle"
              aria-label="Open navigation menu"
              aria-expanded="false"
              data-menu-open
              onClick={onMenuOpen}
            >
              ☰
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
