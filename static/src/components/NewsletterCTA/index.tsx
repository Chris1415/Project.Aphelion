'use client';

/**
 * NewsletterCTA — leaf component (ADR-0005 rule 1 + ADR-0006: presentational only).
 * Flat props: heading, headingAccent, body, placeholder, buttonLabel → each maps to one Sitecore field.
 *
 * TDD GREEN phase: implements validation logic tested in T023a.
 * - submit: preventDefault → validate → error/success state (NEVER fetch)
 * - Validation regex from POC exactly: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
 * - On invalid: aria-invalid="true" + role=alert error + focus input
 * - On valid: hide form, show role=status success, focus success element
 * - input event: clears aria-invalid + hides error
 *
 * Mirrors pocs/poc-v5b-prd000/index.html § newsletter + theme.js newsletter handler.
 */

import { useState, useRef } from 'react';
import { useMagnetic } from '@/lib/motion';
import type { NewsletterCTAProps } from '@/content/home';

// Validation regex from POC (must match exactly — T023b REFACTOR note)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterCTA({
  heading,
  headingAccent,
  body,
  placeholder,
  buttonLabel,
}: NewsletterCTAProps) {
  const [submitted, setSubmitted] = useState(false);
  const [ariaInvalid, setAriaInvalid] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);
  const { ref: btnRef } = useMagnetic<HTMLButtonElement>(0.3);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // NEVER fetch — ADR-0006 (TC-28)
    e.preventDefault();
    const val = (inputRef.current?.value ?? '').trim();
    const valid = EMAIL_REGEX.test(val);

    if (!valid) {
      setAriaInvalid(true);
      setErrorMsg(val === '' ? 'Email is required.' : 'Enter a valid email address.');
      // Focus the input after state update
      setTimeout(() => inputRef.current?.focus(), 0);
      return;
    }

    // Valid — show success
    setAriaInvalid(false);
    setErrorMsg('');
    setSubmitted(true);
    // Focus success element after state update
    setTimeout(() => successRef.current?.focus(), 0);
  }

  function handleInput() {
    if (ariaInvalid) {
      setAriaInvalid(false);
      setErrorMsg('');
    }
  }

  if (submitted) {
    return (
      <section className="band" id="contact" aria-labelledby="nl-h">
        <div className="wrap">
          <div className="newsletter">
            <div className="art-mesh" aria-hidden="true" />
            <p
              ref={successRef}
              className="nl-success"
              role="status"
              tabIndex={-1}
            >
              {"You're on the manifest. Watch the dark."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="band" id="contact" aria-labelledby="nl-h">
      <div className="wrap">
        <div className="newsletter">
          <div className="art-mesh" aria-hidden="true" />
          <span className="eyebrow">Join the manifest</span>
          <h2 id="nl-h" data-reveal="">
            {heading}{' '}
            {headingAccent && <span className="kinetic">{headingAccent}</span>}
          </h2>
          <p data-reveal="" data-delay="1">
            {body}
          </p>
          <form
            className="nl-form"
            noValidate
            onSubmit={handleSubmit}
            data-reveal=""
            data-delay="2"
          >
            <div className="nl-field">
              <label className="sr-only" htmlFor="nl-email">
                Email address
              </label>
              <input
                ref={inputRef}
                className="input"
                id="nl-email"
                type="email"
                name="email"
                placeholder={placeholder}
                autoComplete="email"
                aria-describedby="nl-error"
                aria-invalid={ariaInvalid ? 'true' : undefined}
                required
                onChange={handleInput}
              />
              {errorMsg && (
                <p
                  className="field-error"
                  id="nl-error"
                  role="alert"
                >
                  {errorMsg}
                </p>
              )}
            </div>
            <button
              ref={btnRef}
              className="btn btn-primary"
              data-magnetic="0.3"
              type="submit"
            >
              {buttonLabel}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
