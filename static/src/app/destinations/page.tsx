/**
 * Destinations route — thin server component.
 * Composition (architecture §2.1): PageHero → DestinationsGrid (full set) → NewsletterCTA
 *
 * All props imported from src/content/destinations.ts (plain-prop objects).
 * No data fetching, no @sitecore-* imports (ADR-0003/0007 — zero-SDK invariant).
 */

import { PageHero } from '@/components/PageHero';
import { DestinationsGrid } from '@/components/DestinationsGrid';
import { NewsletterCTA } from '@/components/NewsletterCTA';

import { destinationsHeroContent, destinationsContent } from '@/content/destinations';
import { newsletterContent } from '@/content/home';

export default function DestinationsPage() {
  return (
    <>
      <PageHero {...destinationsHeroContent} />
      {/* Full set — no limit prop; all 6 destinations shown */}
      <DestinationsGrid {...destinationsContent} />
      <NewsletterCTA {...newsletterContent} />
    </>
  );
}
