/**
 * SiteFooter — brand col + 3 nav columns + legal row + faint mesh backdrop.
 * Chrome (ADR-0005 nav exception) — NOT a Sitecore rendering. Ported from the static app.
 * Lives in src/site/ (NOT src/components/). Static nav from src/site/navigation.
 */

import Link from 'next/link';
import { footerNav } from 'src/site/navigation';

export function SiteFooter() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="mesh" aria-hidden="true" style={{ opacity: 0.4 }} />
      <div className="wrap">
        <div className="footer-grid">
          {/* Brand column */}
          <div className="footer-col footer-brand">
            <Link className="brand" href="/" aria-label="Aphelion home">
              <span className="mark" aria-hidden="true" />
              Aphelion
            </Link>
            <p>Premium commercial spaceflight &amp; cosmos living. Drift past the edge of the familiar.</p>
          </div>

          {/* Nav columns from navigation.ts */}
          {footerNav.map((col) => (
            <div key={col.heading} className="footer-col">
              <h4>{col.heading}</h4>
              {col.links.map((link) => (
                <Link key={link.href + link.label} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span>&copy; 2419 Aphelion Spaceflight. A fictional brand for design demonstration.</span>
          <span>Privacy &middot; Terms &middot; Flight policy</span>
        </div>
      </div>
    </footer>
  );
}
