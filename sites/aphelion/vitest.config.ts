import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Head-app component test runner.
 *
 * Tests the PORT LAYER the static app never had: SDK field binding
 * (Text/Image/Link), resolver/integrated-GraphQL payload shapes, empty-state
 * handling, and the server/client component split — asserted against REAL
 * captured Edge fixtures (src/test/fixtures), not hand-authored shapes.
 *
 * Aliases mirror tsconfig.json `paths` so component imports
 * (`lib/*`, `components/*`, `src/*`) resolve the same way they do in Next.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    passWithNoTests: true,
    include: ['src/**/*.test.{ts,tsx}', 'tests/unit/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: [
      { find: /^components\//, replacement: path.resolve(__dirname, 'src/components') + '/' },
      { find: /^lib\//, replacement: path.resolve(__dirname, 'src/lib') + '/' },
      { find: /^temp\//, replacement: path.resolve(__dirname, 'src/temp') + '/' },
      { find: /^assets\//, replacement: path.resolve(__dirname, 'src/assets') + '/' },
      { find: /^\.sitecore\//, replacement: path.resolve(__dirname, '.sitecore') + '/' },
      { find: /^src\//, replacement: path.resolve(__dirname, 'src') + '/' },
    ],
  },
});
