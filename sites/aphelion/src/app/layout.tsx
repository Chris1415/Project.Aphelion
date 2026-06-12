import './globals.css';
import { ThemeProvider } from 'src/ui/theme-provider';
import { RevealController } from 'src/ui/reveal-controller';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* FOUC preflight — parser-blocking (no async/defer), must run before paint.
            Resolves stored choice → applied 'light'|'dark' on <html data-theme>
            and adds html.js class (gates [data-reveal] hide rule).
            ADR-0004: NOT a React inline raw-HTML script. */}
        <script src="/theme-init.js" />
      </head>
      <body>
        <ThemeProvider>
          <RevealController />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
