import './globals.css';
import Script from 'next/script';
import { ThemeProvider } from 'src/ui/theme-provider';
import { RevealController } from 'src/ui/reveal-controller';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* FOUC preflight — runs before hydration; resolves stored choice → applied
            'light'|'dark' on <html data-theme> + adds html.js (gates [data-reveal] hide rule).
            next/script `beforeInteractive` (Next hoists it into <head>) instead of a raw
            <script> tag, which React 19 warns about ("scripts inside components are never
            executed when rendering on the client"). */}
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        <ThemeProvider>
          <RevealController />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
