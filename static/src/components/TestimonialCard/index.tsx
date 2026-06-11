/**
 * TestimonialCard — leaf component (ADR-0005 rule 1).
 * Flat props: quote, author, role, avatar? → each maps to one Sitecore field.
 * Renders .card.quote-card with blockquote + .quote-author (conic-gradient .quote-avatar).
 *
 * Mirrors pocs/poc-v5b-prd000/index.html § testimonials card.
 */

import type { TestimonialCardProps } from '@/content/home';

export function TestimonialCard({ quote, author, role, avatar }: TestimonialCardProps) {
  return (
    <article className="card quote-card" data-reveal="">
      <blockquote>{quote}</blockquote>
      <div className="quote-author">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="quote-avatar"
            src={avatar.src}
            alt={avatar.alt}
            aria-hidden="true"
          />
        ) : (
          <span className="quote-avatar" aria-hidden="true" />
        )}
        <div>
          <div className="name">{author}</div>
          <div className="role">{role}</div>
        </div>
      </div>
    </article>
  );
}
