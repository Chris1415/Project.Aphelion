/**
 * Experiences page content — hard-coded plain-prop objects.
 * ADR-0005: flat props; 1 scalar → 1 Sitecore field.
 * Reuses experience + stats data from home.ts (full set on /experiences).
 */

import type { PageHeroProps } from '@/components/PageHero';
import { experiencesContent, statsBandContent } from '@/content/home';

export type { ExperienceShowcaseProps } from '@/content/home';

export const experiencesHeroContent: PageHeroProps = {
  title: 'Not just a view — a way to be there.',
  subtitle:
    'Every Aphelion voyage is shaped around moments you can only have in the far dark. Here is what waits aboard.',
};

/** Full experience set (all 3 items) */
export { experiencesContent };

/** Stats band — reused verbatim from home */
export { statsBandContent };
