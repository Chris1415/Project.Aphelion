/**
 * SiteFooter — chrome component (nav exception, ADR-0005 rule 3).
 * Not a Sitecore rendering; nav tree is static content from src/content/navigation.ts.
 * Links use Next <Link> to real routes (not #anchors).
 *
 * Mirrors pocs/poc-v5b-prd000/index.html § footer:
 * - .footer-grid: brand col + 3 nav columns
 * - .footer-bottom: legal row
 * - Faint .mesh backdrop
 */

import Link from 'next/link';
import { footerNav } from '@/content/navigation';

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
            <p>Premium commercial spaceflight & cosmos living. Drift past the edge of the familiar.</p>
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
          <span>
            &copy; 2419 Aphelion Spaceflight. A fictional brand for design demonstration.
          </span>
          <span>Privacy &middot; Terms &middot; Flight policy</span>
        </div>
      </div>
    </footer>
  );
}
