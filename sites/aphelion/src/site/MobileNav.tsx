'use client';

/**
 * MobileNav — drawer with focus-trap, Esc close, scrim. Shown below 720px (CSS .menu-toggle).
 * Chrome (ADR-0005 nav exception) — NOT a Sitecore rendering. Ported from the static app.
 * Lives in src/site/ (NOT src/components/). Owns the mobile menu trigger button.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ThemeToggle } from 'src/ui/theme-toggle';
import { headerNav } from 'src/site/navigation';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Keyboard handling: Esc close + focus trap
  useEffect(() => {
    if (!isOpen) return;
    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusable = Array.from(
      drawer.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])')
    ).filter((el) => !el.hasAttribute('disabled') && el.getAttribute('tabindex') !== '-1');

    if (focusable.length > 0) {
      focusable[0].focus();
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (e.key !== 'Tab' || !focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Menu trigger button (visible below 720px via CSS .menu-toggle) */}
      <button
        ref={triggerRef}
        type="button"
        className="menu-toggle"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        data-menu-open
        onClick={open}
      >
        ☰
      </button>

      {/* Scrim */}
      <div
        className={`nav-scrim${isOpen ? ' open' : ''}`}
        data-scrim
        onClick={close}
        aria-hidden="true"
      />

      {/* Drawer — inert when closed prevents focusable children from being tab-reachable */}
      <nav
        ref={drawerRef}
        className={`mobile-nav${isOpen ? ' open' : ''}`}
        aria-hidden={!isOpen}
        inert={!isOpen || undefined}
        aria-label="Mobile navigation"
      >
        <div className="mn-head">
          <span className="brand" style={{ fontSize: '1.1rem' }}>
            Aphelion
          </span>
          <button
            type="button"
            className="menu-toggle"
            aria-label="Close navigation menu"
            data-menu-close
            onClick={close}
          >
            ✕
          </button>
        </div>

        {headerNav.map((link) => (
          <Link key={link.href} href={link.href} onClick={close}>
            {link.label}
          </Link>
        ))}

        <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
          <ThemeToggle />
        </div>
      </nav>
    </>
  );
}
