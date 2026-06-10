/**
 * About page content — hard-coded plain-prop objects.
 * ADR-0005: flat props; 1 scalar → 1 Sitecore field.
 * Reuses valueProps and testimonials from home.ts; adds About-specific PageHero + RichTextSection.
 */

import type { PageHeroProps } from '@/components/PageHero';
import type { RichTextSectionProps } from '@/components/RichTextSection';
import { valuePropsContent, testimonialsContent, statsBandContent } from '@/content/home';

export type { ValuePropsProps } from '@/content/home';
export type { TestimonialsProps } from '@/content/home';

export const aboutHeroContent: PageHeroProps = {
  title: 'We are Aphelion.',
  subtitle:
    'A charter company born from one conviction: the far dark deserves to be witnessed, not just survived.',
};

/**
 * About story — Rich Text field (body is HTML markup; trusted static content).
 * Each <p> maps to a paragraph in the Sitecore Rich Text editor.
 */
export const aboutStoryContent: RichTextSectionProps = {
  heading: 'The long way around',
  body: `
    <p>Aphelion began in 2401, in a converted cargo berth at Umbra Station, with a single converted Lumen-class vessel and twelve guests who wanted to see Caldera Prime from the inside. We had no marketing. We had a manifest and a navigator named Sorel who talked for eight days without pausing for breath.</p>
    <p>Those twelve came back. And they brought others. Word moved the way good things do — quietly, then all at once. By 2410 we operated three vessels. By 2415, seven routes. By 2419 — the year you're reading this — we have carried over twelve hundred guests to the farthest addresses in the system.</p>
    <p>We are not a tour operator. We are not an adventure company. We are, as best we can describe it, a practice: of slowness, of attention, of witnessing the sky as it actually is when you remove the noise of proximity to a star. Come far. Come slowly. Come back changed.</p>
  `,
};

/** ValueProps — reused verbatim from home */
export { valuePropsContent };

/** Testimonials — reused verbatim from home */
export { testimonialsContent };

/** Stats — reused verbatim from home */
export { statsBandContent };
