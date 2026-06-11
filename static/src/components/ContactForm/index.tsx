'use client';

/**
 * ContactForm — leaf component (ADR-0005 rule 1 + ADR-0006: presentational only).
 * Flat props: heading, intro, nameLabel, emailLabel, messageLabel, buttonLabel
 * → each maps to one Sitecore Single-Line Text field.
 *
 * TDD GREEN phase: implements validation logic tested in T028a.
 * - submit: preventDefault → validate per-field → error/success state (NEVER fetch)
 * - Validation: required fields first, then email format
 * - On invalid: aria-invalid="true" per field + role=alert error + focus first invalid field
 * - On valid: show role=status success element
 * - input event: clears aria-invalid on that specific field
 *
 * Visual language mirrors NewsletterCTA: .input, .field-error, .nl-success tokens.
 */

import { useState, useRef } from 'react';
import type { ContactFormProps } from '@/content/contact';

// Validation regex matches POC exactly (T028b REFACTOR note — same as NewsletterCTA)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm({
  heading,
  intro,
  nameLabel,
  emailLabel,
  messageLabel,
  buttonLabel,
}: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  // Per-field error state
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [msgError, setMsgError] = useState('');

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const msgRef = useRef<HTMLTextAreaElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // NEVER fetch — ADR-0006 (TC-35)
    e.preventDefault();

    const nameVal = (nameRef.current?.value ?? '').trim();
    const emailVal = (emailRef.current?.value ?? '').trim();
    const msgVal = (msgRef.current?.value ?? '').trim();

    // Validate — collect errors, focus first invalid
    let firstInvalid: HTMLElement | null = null;

    let nErr = '';
    let eErr = '';
    let mErr = '';

    if (!nameVal) {
      nErr = `${nameLabel} is required.`;
      if (!firstInvalid) firstInvalid = nameRef.current;
    }
    if (!emailVal) {
      eErr = `${emailLabel} is required.`;
      if (!firstInvalid) firstInvalid = emailRef.current;
    } else if (!EMAIL_REGEX.test(emailVal)) {
      eErr = 'Enter a valid email address.';
      if (!firstInvalid) firstInvalid = emailRef.current;
    }
    if (!msgVal) {
      mErr = `${messageLabel} is required.`;
      if (!firstInvalid) firstInvalid = msgRef.current;
    }

    setNameError(nErr);
    setEmailError(eErr);
    setMsgError(mErr);

    if (firstInvalid) {
      setTimeout(() => firstInvalid!.focus(), 0);
      return;
    }

    // All valid — show success
    setSubmitted(true);
    setTimeout(() => successRef.current?.focus(), 0);
  }

  function clearFieldError(
    setter: React.Dispatch<React.SetStateAction<string>>
  ) {
    setter('');
  }

  if (submitted) {
    return (
      <section className="band contact-band" aria-labelledby="cf-h">
        <div className="wrap contact-inner">
          <div className="newsletter contact-form-panel">
            <div className="art-mesh" aria-hidden="true" />
            <p
              ref={successRef}
              className="nl-success"
              role="status"
              tabIndex={-1}
            >
              {"Your enquiry is on the manifest. We'll be in touch within one orbit."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="band contact-band" aria-labelledby="cf-h">
      <div className="wrap contact-inner">
        <div className="newsletter contact-form-panel">
          <div className="art-mesh" aria-hidden="true" />

          <div className="contact-form-head">
            <h2 id="cf-h" data-reveal="">
              {heading}
            </h2>
            <p data-reveal="" data-delay="1">
              {intro}
            </p>
          </div>

          <form
            className="contact-form"
            noValidate
            onSubmit={handleSubmit}
            data-reveal=""
            data-delay="2"
          >
            {/* Name field */}
            <div className="nl-field">
              <label htmlFor="cf-name" className="field-label">
                {nameLabel}
              </label>
              <input
                ref={nameRef}
                className="input"
                id="cf-name"
                type="text"
                name="name"
                autoComplete="name"
                aria-describedby="cf-name-error"
                aria-invalid={nameError ? 'true' : undefined}
                onChange={() => clearFieldError(setNameError)}
              />
              {nameError && (
                <p className="field-error" id="cf-name-error" role="alert">
                  {nameError}
                </p>
              )}
            </div>

            {/* Email field */}
            <div className="nl-field">
              <label htmlFor="cf-email" className="field-label">
                {emailLabel}
              </label>
              <input
                ref={emailRef}
                className="input"
                id="cf-email"
                type="email"
                name="email"
                autoComplete="email"
                aria-describedby="cf-email-error"
                aria-invalid={emailError ? 'true' : undefined}
                onChange={() => clearFieldError(setEmailError)}
              />
              {emailError && (
                <p className="field-error" id="cf-email-error" role="alert">
                  {emailError}
                </p>
              )}
            </div>

            {/* Message field */}
            <div className="nl-field">
              <label htmlFor="cf-message" className="field-label">
                {messageLabel}
              </label>
              <textarea
                ref={msgRef}
                className="input contact-textarea"
                id="cf-message"
                name="message"
                rows={5}
                aria-describedby="cf-message-error"
                aria-invalid={msgError ? 'true' : undefined}
                onChange={() => clearFieldError(setMsgError)}
              />
              {msgError && (
                <p className="field-error" id="cf-message-error" role="alert">
                  {msgError}
                </p>
              )}
            </div>

            <button className="btn btn-primary" type="submit">
              {buttonLabel}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
