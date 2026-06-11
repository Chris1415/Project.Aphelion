'use client';

/**
 * Stat — leaf component (ADR-0005 rule 1).
 * Flat props: value, label + count-up metadata (countTo, decimals, suffix, prefix).
 * Animates from 0 to countTo via useCountUp (scroll-triggered easeOutCubic).
 * Reduced-motion: shows final value immediately.
 *
 * .kinetic on the numeral for gradient headline treatment.
 * Mirrors pocs/poc-v5b-prd000/index.html § stats stat element.
 */

import { useCountUp } from '@/lib/motion';
import type { StatProps } from '@/content/home';

export function Stat({ label, countTo, decimals, suffix, prefix }: StatProps) {
  const { ref, displayValue } = useCountUp(countTo, { decimals, suffix, prefix });

  return (
    <div className="stat" data-reveal="">
      <div className="v">
        <span className="kinetic" ref={ref} data-countup={String(countTo)}>
          {displayValue}
        </span>
      </div>
      <div className="l">{label}</div>
    </div>
  );
}
