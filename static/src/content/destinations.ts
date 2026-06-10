/**
 * Destinations page content — hard-coded plain-prop objects.
 * ADR-0005: flat props; 1 scalar → 1 Sitecore field.
 * Reuses destination data from home.ts (full set — no limit on /destinations).
 */

import type { PageHeroProps } from '@/components/PageHero';
import { destinationsContent } from '@/content/home';

export type { DestinationsGridProps } from '@/content/home';

export const destinationsHeroContent: PageHeroProps = {
  title: 'Six points worth the distance.',
  subtitle:
    'From the inner glow of the Halcyon Belt to the long dark of Aphelion Point — choose where your story bends.',
};

/** Full destination set (all 6 items — no limit prop for /destinations) */
export { destinationsContent };
