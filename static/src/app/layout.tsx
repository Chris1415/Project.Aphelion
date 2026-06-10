import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/ui/theme-provider';
import { SiteHeader } from '@/components/chrome/SiteHeader';
import { MobileNav } from '@/components/chrome/MobileNav';
import { SiteFooter } from '@/components/chrome/SiteFooter';
import { RevealController } from '@/ui/reveal-controller';

/**
 * Root layout — App Router
 * ADR-0004:
 *   - <html suppressHydrationWarning> masks the FOUC-preflight attribute set before React hydrates
 *   - <script src="/theme-init.js"> is parser-blocking (no async/defer) — sets data-theme before paint
 *   - ThemeProvider uses useSyncExternalStore (NOT setState-in-effect)
 *   - inline #gooey SVG filter injected once at top of <body> (for .flux-field { filter:url(#gooey) })
 */

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Aphelion — Cosmos Travel',
  description:
    'Journey beyond the horizon. Discover extraordinary cosmic destinations with Aphelion.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={outfit.variable}>
      <head>
        {/* Parser-blocking FOUC preflight — sets data-theme BEFORE paint. ADR-0004. */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/theme-init.js" />
      </head>
      <body>
        {/* Inline gooey SVG filter — required once per document for .flux-field { filter:url(#gooey) }
            Injected at body top so it is available when Hero renders. aria-hidden + visibility:hidden
            ensures it takes no layout space and is invisible to AT. */}
        <svg
          aria-hidden="true"
          focusable="false"
          style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
        >
          <defs>
            <filter id="gooey">
              <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -11"
                result="gooey"
              />
              <feBlend in="SourceGraphic" in2="gooey" />
            </filter>
          </defs>
        </svg>

        <ThemeProvider>
          {/* Global scroll-reveal controller — queries [data-reveal] on mount,
              adds .in via IntersectionObserver. Renders nothing. ADR-0007. */}
          <RevealController />

          {/* Skip-to-main link for keyboard users */}
          <a href="#main" className="skip-link">
            Skip to main content
          </a>

          {/* SiteHeader + MobileNav are client-side interactive; MobileNav owns the trigger button */}
          <SiteHeader />
          <MobileNav />

          <main id="main">{children}</main>

          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
