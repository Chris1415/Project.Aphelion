import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config-cli';
import {
  generateSites,
  generateMetadata,
  extractFiles,
  writeImportMap,
} from '@sitecore-content-sdk/nextjs/tools';
import scConfig from './sitecore.config';

export default defineCliConfig({
  config: scConfig,
  build: {
    commands: [
      generateMetadata(),
      generateSites(),
      extractFiles(),
      writeImportMap({
        paths: ['src/components'],
      }),
    ],
  },
  componentMap: {
    paths: ['src/components'],
    // Never register colocated test files as Content SDK components — generate-map
    // scans src/components and would otherwise emit `Promo.test`, `ValueProps.test`
    // into the component map and break `next build` (build-trap #5).
    exclude: [
      'src/components/content-sdk/*',
      'src/components/**/*.test.ts',
      'src/components/**/*.test.tsx',
      'src/components/**/*.spec.ts',
      'src/components/**/*.spec.tsx',
    ],
  },
});
