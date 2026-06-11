/**
 * Contact page content — hard-coded plain-prop objects.
 * ADR-0005: each object's shape IS the future datasource (flat props; 1 scalar → 1 Sitecore field).
 * ADR-0006: ContactForm is presentational only — no submit backend.
 */

import type { PageHeroProps } from '@/components/PageHero';

// ---------------------------------------------------------------------------
// ContactForm Props — exported for use by ContactForm component
// ---------------------------------------------------------------------------

export interface ContactFormProps {
  heading: string;
  intro: string;
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  buttonLabel: string;
}

// ---------------------------------------------------------------------------
// Contact page content objects
// ---------------------------------------------------------------------------

export const contactHeroContent: PageHeroProps = {
  title: 'Begin your voyage.',
  subtitle:
    "Interested in a charter, a specific route, or simply the idea of drifting further than you've been? We're here.",
};

export const contactFormContent: ContactFormProps = {
  heading: 'Send an enquiry',
  intro:
    "Tell us where you'd like to go, when, and how many guests. We'll reach out within one orbit.",
  nameLabel: 'Your name',
  emailLabel: 'Your email',
  messageLabel: 'Your message',
  buttonLabel: 'Send enquiry',
};

// ---------------------------------------------------------------------------
// Contact details (rendered alongside the form)
// ---------------------------------------------------------------------------

export interface ContactDetailProps {
  label: string;
  value: string;
  href?: string;
}

export interface ContactDetailsProps {
  heading: string;
  items: ContactDetailProps[];
}

export const contactDetailsContent: ContactDetailsProps = {
  heading: 'Other ways to reach us',
  items: [
    {
      label: 'Manifest line',
      value: '+1 (800) APH-ELIO',
      href: 'tel:+18002743546',
    },
    {
      label: 'Email',
      value: 'voyages@aphelion.example',
      href: 'mailto:voyages@aphelion.example',
    },
    {
      label: 'Response time',
      value: 'Within one orbit — typically 24 hours.',
    },
  ],
};
