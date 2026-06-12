'use client';

/**
 * NewsletterCTA — SDK field-driven leaf component (Client map — form input state).
 * ADR-0005 Shape A: flat datasource fields.
 * ADR-0006: Presentational only — full client UI/validation/states, NO network submit, NO backend.
 * Field names: Heading, HeadingAccent, Body, Placeholder, ButtonLabel.
 * componentName: "NewsletterCTA" (verbatim, ADR-0010).
 *
 * Markup/CSS ported verbatim from static/src/components/NewsletterCTA/index.tsx.
 * Form validation logic preserved exactly (EMAIL_REGEX, error/success states, focus management).
 * SDK fields drive all copy/labels; form behavior is purely client-side.
 *
 * SDK shapes (verified at T003 against sites/aphelion/node_modules):
 *   TextField    node_modules/@sitecore-content-sdk/react/types/components/Text.d.ts:8
 */

import { JSX, useState, useRef } from 'react';
import { Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentRendering, ComponentParams } from '@sitecore-content-sdk/nextjs';
import { useMagnetic } from 'lib/motion';

export interface NewsletterCTAFields {
  Heading?: TextField;
  HeadingAccent?: TextField;
  Body?: TextField;
  Placeholder?: TextField;
  ButtonLabel?: TextField;
}

export interface NewsletterCTAProps {
  rendering: ComponentRendering & { fields?: NewsletterCTAFields };
  fields?: NewsletterCTAFields;
  params?: ComponentParams;
}

// Validation regex from POC exactly (ADR-0006)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NewsletterCTA = ({ fields }: NewsletterCTAProps): JSX.Element => {
  const [submitted, setSubmitted] = useState(false);
  const [ariaInvalid, setAriaInvalid] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);
  const { ref: btnRef } = useMagnetic<HTMLButtonElement>(0.3);

  // In Pages editing, render every field (even empty) so the SDK field helper shows
  // its editable placeholder; published view stays clean when empty.
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;

  // Derive plain string for placeholder attribute (SDK TextField → string)
  const placeholderText = String(fields?.Placeholder?.value ?? '');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // NEVER fetch — ADR-0006
    e.preventDefault();
    const val = (inputRef.current?.value ?? '').trim();
    const valid = EMAIL_REGEX.test(val);

    if (!valid) {
      setAriaInvalid(true);
      setErrorMsg(val === '' ? 'Email is required.' : 'Enter a valid email address.');
      setTimeout(() => inputRef.current?.focus(), 0);
      return;
    }

    setAriaInvalid(false);
    setErrorMsg('');
    setSubmitted(true);
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
            <Text field={fields?.Heading} />
            {fields?.HeadingAccent && (isEditing || fields.HeadingAccent.value) && (
              <>
                {' '}
                <span className="kinetic">
                  <Text field={fields.HeadingAccent} />
                </span>
              </>
            )}
          </h2>
          <p data-reveal="" data-delay="1">
            <Text field={fields?.Body} />
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
                placeholder={placeholderText}
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
              <Text field={fields?.ButtonLabel} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterCTA;
