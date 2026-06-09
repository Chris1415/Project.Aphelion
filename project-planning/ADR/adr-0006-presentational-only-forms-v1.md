# ADR-0006: Newsletter + Contact are presentational-only in v1

## Status

Accepted

## Context

Aphelion's design includes a newsletter capture and a contact form. A real submission backend (email/CRM integration, spam protection, server actions, persistence) is a meaningful scope expansion with its own failure surface, and is orthogonal to the dogfood's purpose (exercising the Content SDK static-app → port flow). The forms still carry content (heading, intro, field labels, button label) that belongs in the content model.

## Decision

In v1 (PRD-000 + PRD-001), `NewsletterCTA` and `ContactForm` are **presentational only**: full client-side UI and validation with default/focus/error/success/empty states, but **no network submit** and no backend. Their copy/labels still get a Sitecore datasource template (`Newsletter`, `Contact Form`) so the content is authorable; the spec flags them as having no submit target. A real forms backend is a deferred future PRD.

## Consequences

- **Easier:** no backend, no server actions, no secrets, no spam/abuse surface in v1; the forms still port cleanly as content-authored components.
- **Easier:** keeps the dogfood focused on the rendering/port flow.
- **Harder:** the forms do not actually capture leads — they are a visual/UX placeholder until a future PRD wires a backend; users could mistake them for functional (mitigated by clear success-state copy framing it as a demo).

## Date

2026-06-09
