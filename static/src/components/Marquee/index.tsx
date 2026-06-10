/**
 * Marquee — leaf component (ADR-0005 rule 1).
 * Infinite scrolling destination name strip.
 * Mirrors pocs/poc-v5b-prd000/index.html § marquee exactly.
 *
 * - Duplicates items array for seamless loop (CSS keyframe)
 * - aria-hidden: decorative (content duplicated; screen readers skip)
 * - Hover pauses animation (CSS animation-play-state: paused via .marquee:hover .marquee-track)
 * - Reduced-motion: global @media freeze in globals.css handles it at CSS level
 */

import type { MarqueeProps } from '@/content/home';

export function Marquee({ items }: MarqueeProps) {
  // Duplicate items for the seamless CSS loop (per POC pattern)
  const allItems = [...items, ...items];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {allItems.map((item, idx) => (
          // key by index is intentional: duplicated items have identical text, no reordering
          <span key={`marquee-${idx}`} className="marquee-item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
