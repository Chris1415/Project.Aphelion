/**
 * Contact route — thin server component.
 * Composition (architecture §2.1): PageHero → ContactForm
 *
 * All props imported from src/content/contact.ts (plain-prop objects).
 * ContactForm is presentational only — no network submit (ADR-0006).
 * No data fetching, no @sitecore-* imports (ADR-0003/0007 — zero-SDK invariant).
 */

import { PageHero } from '@/components/PageHero';
import { ContactForm } from '@/components/ContactForm';

import {
  contactHeroContent,
  contactFormContent,
  contactDetailsContent,
} from '@/content/contact';

export default function ContactPage() {
  return (
    <>
      <PageHero {...contactHeroContent} />
      <ContactForm {...contactFormContent} />

      {/* Contact details — rendered alongside the form as supplemental info */}
      <section className="band contact-details-band" aria-labelledby="cd-h">
        <div className="wrap">
          <h2 id="cd-h" className="contact-details-heading" data-reveal="">
            {contactDetailsContent.heading}
          </h2>
          <ul className="contact-details-list" data-reveal="" data-delay="1">
            {contactDetailsContent.items.map((item) => (
              <li key={item.label} className="contact-detail-item">
                <span className="contact-detail-label">{item.label}</span>
                {item.href ? (
                  <a href={item.href} className="contact-detail-value dest-link">
                    {item.value}
                  </a>
                ) : (
                  <span className="contact-detail-value">{item.value}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
