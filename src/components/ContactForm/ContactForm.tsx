'use client';

/**
 * ContactForm — SDK field-driven leaf component (Client map — form input state).
 * ADR-0005 Shape A: flat datasource fields.
 * ADR-0006: Presentational only — full client UI/validation/states, NO network submit, NO backend.
 * Field names: FormHeading, Intro, NameLabel, EmailLabel, MessageLabel, ButtonLabel.
 * componentName: "ContactForm" (verbatim, ADR-0010).
 *
 * Markup/CSS ported verbatim from static/src/components/ContactForm/index.tsx.
 * SDK fields drive all copy/labels; form behavior is purely client-side.
 * Validation logic preserved exactly (EMAIL_REGEX, per-field error states, focus management).
 *
 * SDK shapes (verified at T003 against sites/aphelion/node_modules):
 *   TextField    node_modules/@sitecore-content-sdk/react/types/components/Text.d.ts:8
 */

import { JSX, useState, useRef } from 'react';
import { Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import type { TextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentRendering, ComponentParams } from '@sitecore-content-sdk/nextjs';

export interface ContactFormFields {
  FormHeading?: TextField;
  Intro?: TextField;
  NameLabel?: TextField;
  EmailLabel?: TextField;
  MessageLabel?: TextField;
  ButtonLabel?: TextField;
}

export interface ContactFormProps {
  rendering: ComponentRendering & { fields?: ContactFormFields };
  fields?: ContactFormFields;
  params?: ComponentParams;
}

// Validation regex matches POC exactly (same as NewsletterCTA)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ContactForm = ({ fields }: ContactFormProps): JSX.Element => {
  const [submitted, setSubmitted] = useState(false);

  // Per-field error state
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [msgError, setMsgError] = useState('');

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const msgRef = useRef<HTMLTextAreaElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);

  // In Pages editing the form is inert (see handleSubmit) so authors can select the
  // label/button fields without triggering validation.
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;

  // Derive plain strings for validation error messages (use field value strings)
  const nameLabelText = String(fields?.NameLabel?.value ?? 'Name');
  const emailLabelText = String(fields?.EmailLabel?.value ?? 'Email');
  const messageLabelText = String(fields?.MessageLabel?.value ?? 'Message');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // NEVER fetch — ADR-0006
    e.preventDefault();
    // In Pages editing the form is inert: clicking the submit button is how the author
    // selects the ButtonLabel field to edit it — running validation would fight that.
    if (isEditing) return;

    const nameVal = (nameRef.current?.value ?? '').trim();
    const emailVal = (emailRef.current?.value ?? '').trim();
    const msgVal = (msgRef.current?.value ?? '').trim();

    let firstInvalid: HTMLElement | null = null;

    let nErr = '';
    let eErr = '';
    let mErr = '';

    if (!nameVal) {
      nErr = `${nameLabelText} is required.`;
      if (!firstInvalid) firstInvalid = nameRef.current;
    }
    if (!emailVal) {
      eErr = `${emailLabelText} is required.`;
      if (!firstInvalid) firstInvalid = emailRef.current;
    } else if (!EMAIL_REGEX.test(emailVal)) {
      eErr = 'Enter a valid email address.';
      if (!firstInvalid) firstInvalid = emailRef.current;
    }
    if (!msgVal) {
      mErr = `${messageLabelText} is required.`;
      if (!firstInvalid) firstInvalid = msgRef.current;
    }

    setNameError(nErr);
    setEmailError(eErr);
    setMsgError(mErr);

    if (firstInvalid) {
      setTimeout(() => firstInvalid!.focus(), 0);
      return;
    }

    setSubmitted(true);
    setTimeout(() => successRef.current?.focus(), 0);
  }

  function clearFieldError(setter: React.Dispatch<React.SetStateAction<string>>) {
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
              <Text field={fields?.FormHeading} />
            </h2>
            <p data-reveal="" data-delay="1">
              <Text field={fields?.Intro} />
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
              {/* htmlFor dropped in editing so clicking the label selects the
                  NameLabel field for authoring instead of focusing the input */}
              <label htmlFor={isEditing ? undefined : 'cf-name'} className="field-label">
                <Text field={fields?.NameLabel} />
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
              <label htmlFor={isEditing ? undefined : 'cf-email'} className="field-label">
                <Text field={fields?.EmailLabel} />
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
              <label htmlFor={isEditing ? undefined : 'cf-message'} className="field-label">
                <Text field={fields?.MessageLabel} />
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

            <button className="btn btn-primary" type={isEditing ? 'button' : 'submit'}>
              <Text field={fields?.ButtonLabel} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
