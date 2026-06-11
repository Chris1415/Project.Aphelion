/**
 * Experiences route — thin server component.
 * Composition (architecture §2.1): PageHero → ExperienceShowcase (full) → StatsBand → NewsletterCTA
 *
 * All props imported from src/content/experiences.ts (plain-prop objects).
 * No data fetching, no @sitecore-* imports (ADR-0003/0007 — zero-SDK invariant).
 */

import { PageHero } from '@/components/PageHero';
import { ExperienceShowcase } from '@/components/ExperienceShowcase';
import { StatsBand } from '@/components/StatsBand';
import { NewsletterCTA } from '@/components/NewsletterCTA';

import {
  experiencesHeroContent,
  experiencesContent,
  statsBandContent,
} from '@/content/experiences';
import { newsletterContent } from '@/content/home';

export default function ExperiencesPage() {
  return (
    <>
      <PageHero {...experiencesHeroContent} />
      <ExperienceShowcase {...experiencesContent} />
      <StatsBand {...statsBandContent} />
      <NewsletterCTA {...newsletterContent} />
    </>
  );
}
