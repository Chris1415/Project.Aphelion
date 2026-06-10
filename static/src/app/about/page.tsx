/**
 * About route — thin server component.
 * Composition (architecture §2.1): PageHero → RichTextSection → ValueProps → Testimonials
 *
 * All props imported from src/content/about.ts (plain-prop objects).
 * No data fetching, no @sitecore-* imports (ADR-0003/0007 — zero-SDK invariant).
 */

import { PageHero } from '@/components/PageHero';
import { RichTextSection } from '@/components/RichTextSection';
import { ValueProps } from '@/components/ValueProps';
import { Testimonials } from '@/components/Testimonials';

import {
  aboutHeroContent,
  aboutStoryContent,
  valuePropsContent,
  testimonialsContent,
} from '@/content/about';

export default function AboutPage() {
  return (
    <>
      <PageHero {...aboutHeroContent} />
      <RichTextSection {...aboutStoryContent} />
      <ValueProps {...valuePropsContent} />
      <Testimonials {...testimonialsContent} />
    </>
  );
}
