/**
 * Home route — thin server component.
 * Composes all home bands in PRD-000 §2.1 order:
 *   Hero → Marquee → ValueProps → DestinationsGrid (preview) → ExperienceShowcase
 *   → StatsBand → PromoBand → Testimonials → NewsletterCTA
 *
 * All props imported from src/content/home.ts (plain-prop objects).
 * No data fetching, no @sitecore-* imports (ADR-0003/0007 — zero-SDK invariant).
 */

import { Hero } from '@/components/Hero';
import { Marquee } from '@/components/Marquee';
import { ValueProps } from '@/components/ValueProps';
import { DestinationsGrid } from '@/components/DestinationsGrid';
import { ExperienceShowcase } from '@/components/ExperienceShowcase';
import { StatsBand } from '@/components/StatsBand';
import { PromoBand } from '@/components/PromoBand';
import { Testimonials } from '@/components/Testimonials';
import { NewsletterCTA } from '@/components/NewsletterCTA';

import {
  heroContent,
  marqueeContent,
  valuePropsContent,
  destinationsContent,
  experiencesContent,
  statsBandContent,
  promoBandContent,
  testimonialsContent,
  newsletterContent,
} from '@/content/home';

export default function HomePage() {
  return (
    <>
      <Hero {...heroContent} />
      <Marquee {...marqueeContent} />
      <ValueProps {...valuePropsContent} />
      {/* Preview: first 3 destinations on Home; full set on /destinations */}
      <DestinationsGrid {...destinationsContent} limit={3} />
      <ExperienceShowcase {...experiencesContent} />
      <StatsBand {...statsBandContent} />
      <PromoBand {...promoBandContent} />
      <Testimonials {...testimonialsContent} />
      <NewsletterCTA {...newsletterContent} />
    </>
  );
}
