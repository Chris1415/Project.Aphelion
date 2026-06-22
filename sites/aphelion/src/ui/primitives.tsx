/**
 * UI primitives — Container, Band, Button
 * ADR-0007: styling conveniences only; live in src/ui/ (NOT src/components/).
 * Kept here so the future head-app generate-map scanner does NOT register them
 * as Sitecore renderings.
 */

import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';

// ---- Container (max-width wrap + gutter) -----------------------------------
interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'main';
}

export function Container({ children, className = '', as: Tag = 'div' }: ContainerProps) {
  return <Tag className={`wrap ${className}`}>{children}</Tag>;
}

// ---- Band (section padding, optional mesh/atmos) ---------------------------
interface BandProps {
  children: ReactNode;
  className?: string;
  atmos?: boolean;
  id?: string;
  as?: 'section' | 'div' | 'article';
}

export function Band({ children, className = '', atmos = false, id, as: Tag = 'section' }: BandProps) {
  const cls = ['band', atmos ? 'atmos' : '', className].filter(Boolean).join(' ');
  return (
    <Tag className={cls} id={id}>
      {children}
    </Tag>
  );
}

// ---- Button (supports --mx/--my magnetic transform vars) -------------------
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  children: ReactNode;
  magnetic?: boolean;
}

export function Button({ variant = 'primary', children, className = '', magnetic, ...rest }: ButtonProps) {
  const cls = [
    'btn',
    variant === 'primary' ? 'btn-primary' : 'btn-ghost',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={cls}
      {...(magnetic ? { 'data-magnetic': '0.3' } : {})}
      {...rest}
    >
      {children}
    </button>
  );
}

// ---- LinkButton (anchor with button styling) --------------------------------
interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'ghost';
  children: ReactNode;
  magnetic?: boolean;
}

export function LinkButton({ variant = 'primary', children, className = '', magnetic, ...rest }: LinkButtonProps) {
  const cls = [
    'btn',
    variant === 'primary' ? 'btn-primary' : 'btn-ghost',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <a
      className={cls}
      {...(magnetic ? { 'data-magnetic': '0.3' } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
